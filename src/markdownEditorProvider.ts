import * as vscode from 'vscode';

export class MarkdownEditorProvider implements vscode.CustomTextEditorProvider {
  private static readonly viewType = 'bellaMD.markdownEditor';

  private readonly extensionUri: vscode.Uri;

  /** Hash of the last content received from the webview, used for echo prevention. */
  private lastWebviewContentHash = '';

  /** The currently active webview panel, used by keybinding commands. */
  private activeWebviewPanel: vscode.WebviewPanel | undefined;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.extensionUri = context.extensionUri;
  }

  /* ------------------------------------------------------------------ */
  /*  Registration                                                       */
  /* ------------------------------------------------------------------ */

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new MarkdownEditorProvider(context);

    // Register keybinding commands once (not per-editor) to avoid duplicate registration errors
    const commands = ['toggleBold', 'toggleItalic', 'toggleUnderline', 'toggleStrikethrough'];
    for (const cmd of commands) {
      context.subscriptions.push(
        vscode.commands.registerCommand(`bellaMD.${cmd}`, () => {
          provider.activeWebviewPanel?.webview.postMessage({ type: 'command', command: cmd });
        }),
      );
    }

    return vscode.window.registerCustomEditorProvider(
      MarkdownEditorProvider.viewType,
      provider,
      {
        supportsMultipleEditorsPerDocument: false,
        webviewOptions: { retainContextWhenHidden: true },
      },
    );
  }

  /* ------------------------------------------------------------------ */
  /*  CustomTextEditorProvider                                           */
  /* ------------------------------------------------------------------ */

  async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken,
  ): Promise<void> {
    // Large file guard — offer to open in default text editor
    const textLength = document.getText().length;
    if (textLength > 500_000) {
      const choice = await vscode.window.showWarningMessage(
        `This file is ${(textLength / 1_000_000).toFixed(1)}MB. Large files may slow down the WYSIWYG editor.`,
        'Open as Text',
        'Open Anyway',
      );
      if (choice === 'Open as Text') {
        await vscode.commands.executeCommand('vscode.openWith', document.uri, 'default');
        return;
      }
    }

    // Track the active panel for keybinding commands
    this.activeWebviewPanel = webviewPanel;

    // Store frontmatter separately — it's stripped from the editor and re-prepended on save
    let storedFrontmatter = '';

    const docDir = vscode.Uri.joinPath(document.uri, '..');
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this.extensionUri, 'dist'),
        docDir,
      ],
    };

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    // --- Webview -> Extension: user edits --------------------------------
    const messageSubscription = webviewPanel.webview.onDidReceiveMessage(
      async (message: { type: string; content?: string }) => {
        // Webview signals it has loaded and is ready to receive content.
        if (message.type === 'ready') {
          const { frontmatter, body } = this.extractFrontmatter(document.getText());
          storedFrontmatter = frontmatter;
          webviewPanel.webview.postMessage({
            type: 'init',
            content: this.resolveImagePaths(body, webviewPanel.webview, document.uri),
          });
          return;
        }

        if (message.type === 'pasteImage') {
          const { data, ext } = message as unknown as { type: string; data: string; ext: string };
          const docDir = vscode.Uri.joinPath(document.uri, '..');
          const now = new Date();
          const timestamp = now.toISOString().replace(/[-:T]/g, '').slice(0, 15);
          const filename = `image-${timestamp}.${ext}`;
          const imageUri = vscode.Uri.joinPath(docDir, filename);

          // Extract base64 data (strip data URL prefix)
          const base64 = data.replace(/^data:image\/[^;]+;base64,/, '');
          const buffer = Buffer.from(base64, 'base64');
          await vscode.workspace.fs.writeFile(imageUri, buffer);

          // Send back the webview-safe URI for the saved file
          const savedSrc = webviewPanel.webview.asWebviewUri(imageUri).toString();
          webviewPanel.webview.postMessage({
            type: 'imageSaved',
            tempSrc: data,
            savedSrc,
          });
          return;
        }

        if (message.type !== 'edit') {
          return;
        }

        const unresolvedContent = this.unresolveImagePaths(message.content!, webviewPanel.webview, document.uri);
        const fullContent = storedFrontmatter + unresolvedContent;
        const currentText = document.getText();
        if (fullContent === currentText) {
          return;
        }

        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(currentText.length),
        );

        this.lastWebviewContentHash = this.hashContent(fullContent);

        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, fullRange, fullContent);
        await vscode.workspace.applyEdit(edit);
      },
    );

    // --- Extension -> Webview: external changes --------------------------
    const documentChangeSubscription =
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document.uri.toString() !== document.uri.toString()) {
          return;
        }
        // Echo prevention: if this change matches what the webview just sent, skip
        const contentHash = this.hashContent(document.getText());
        if (contentHash === this.lastWebviewContentHash) {
          this.lastWebviewContentHash = '';
          return;
        }
        const { frontmatter, body } = this.extractFrontmatter(document.getText());
        storedFrontmatter = frontmatter;
        webviewPanel.webview.postMessage({
          type: 'update',
          content: this.resolveImagePaths(body, webviewPanel.webview, document.uri),
        });
      });

    // --- Save handling ----------------------------------------------------
    const saveSubscription = vscode.workspace.onDidSaveTextDocument((saved) => {
      if (saved.uri.toString() !== document.uri.toString()) {
        return;
      }
      // No-op for now – placeholder for future save-time behaviour.
    });

    // --- Cleanup ----------------------------------------------------------
    webviewPanel.onDidDispose(() => {
      messageSubscription.dispose();
      documentChangeSubscription.dispose();
      saveSubscription.dispose();
      if (this.activeWebviewPanel === webviewPanel) {
        this.activeWebviewPanel = undefined;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                            */
  /* ------------------------------------------------------------------ */

  private extractFrontmatter(text: string): { frontmatter: string; body: string } {
    const match = text.match(/^(---\r?\n[\s\S]*?\r?\n---\r?\n?)/);
    if (match) {
      return { frontmatter: match[1], body: text.slice(match[1].length) };
    }
    return { frontmatter: '', body: text };
  }

  private resolveImagePaths(markdown: string, webview: vscode.Webview, docUri: vscode.Uri): string {
    const docDir = vscode.Uri.joinPath(docUri, '..');
    return markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
      if (/^(https?:|data:|vscode-webview-resource:)/.test(src)) return match;
      const resolved = vscode.Uri.joinPath(docDir, src);
      const webviewUri = webview.asWebviewUri(resolved);
      return `![${alt}](${webviewUri})`;
    });
  }

  private unresolveImagePaths(markdown: string, webview: vscode.Webview, docUri: vscode.Uri): string {
    const docDir = vscode.Uri.joinPath(docUri, '..');
    const docDirWebviewUri = webview.asWebviewUri(docDir).toString();
    return markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
      if (src.startsWith(docDirWebviewUri)) {
        const relativePath = decodeURIComponent(src.slice(docDirWebviewUri.length + 1));
        return `![${alt}](${relativePath})`;
      }
      return match;
    });
  }

  private hashContent(content: string): string {
    // Simple fast hash — djb2
    let hash = 5381;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) + hash + content.charCodeAt(i)) & 0xffffffff;
    }
    return hash.toString(36);
  }

  /* ------------------------------------------------------------------ */
  /*  Webview HTML                                                       */
  /* ------------------------------------------------------------------ */

  private getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview.js'),
    );

    const nonce = getNonce();

    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'none'; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} https: data:;"
  />
  <title>BellaMD</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: var(--vscode-editor-background, #ffffff);
      overflow: hidden;
    }
    #editor {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div id="editor"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

/* -------------------------------------------------------------------- */
/*  Helpers                                                              */
/* -------------------------------------------------------------------- */

function getNonce(): string {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = new Uint8Array(32);
  for (let i = 0; i < values.length; i++) {
    values[i] = Math.floor(Math.random() * possible.length);
  }
  return Array.from(values, (v) => possible[v]).join('');
}
