import * as vscode from 'vscode';

export class MarkdownEditorProvider implements vscode.CustomTextEditorProvider {
  private static readonly viewType = 'mdExt.markdownEditor';

  private readonly extensionUri: vscode.Uri;

  /** Flag to suppress echo when we apply an edit originating from the webview. */
  private isApplyingEdit = false;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.extensionUri = context.extensionUri;
  }

  /* ------------------------------------------------------------------ */
  /*  Registration                                                       */
  /* ------------------------------------------------------------------ */

  static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new MarkdownEditorProvider(context);
    return vscode.window.registerCustomEditorProvider(
      MarkdownEditorProvider.viewType,
      provider,
      { supportsMultipleEditorsPerDocument: false },
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
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'dist')],
    };

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    // --- Webview -> Extension: user edits --------------------------------
    const messageSubscription = webviewPanel.webview.onDidReceiveMessage(
      async (message: { type: string; content: string }) => {
        // Webview signals it has loaded and is ready to receive content.
        if (message.type === 'ready') {
          webviewPanel.webview.postMessage({
            type: 'init',
            content: document.getText(),
          });
          return;
        }

        if (message.type !== 'edit') {
          return;
        }

        const currentText = document.getText();
        if (message.content === currentText) {
          return;
        }

        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(currentText.length),
        );

        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, fullRange, message.content);

        this.isApplyingEdit = true;
        try {
          await vscode.workspace.applyEdit(edit);
        } finally {
          this.isApplyingEdit = false;
        }
      },
    );

    // --- Extension -> Webview: external changes --------------------------
    const documentChangeSubscription =
      vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document.uri.toString() !== document.uri.toString()) {
          return;
        }
        if (this.isApplyingEdit) {
          return;
        }
        webviewPanel.webview.postMessage({
          type: 'update',
          content: document.getText(),
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
    });
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
    content="default-src 'none'; script-src 'nonce-${nonce}'; style-src ${webview.cspSource} 'unsafe-inline';"
  />
  <title>Markdown Editor</title>
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
