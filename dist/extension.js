"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);

// src/markdownEditorProvider.ts
var vscode = __toESM(require("vscode"));
var MarkdownEditorProvider = class _MarkdownEditorProvider {
  constructor(context) {
    this.context = context;
    /** Flag to suppress echo when we apply an edit originating from the webview. */
    this.isApplyingEdit = false;
    this.extensionUri = context.extensionUri;
  }
  static {
    this.viewType = "mdExt.markdownEditor";
  }
  /* ------------------------------------------------------------------ */
  /*  Registration                                                       */
  /* ------------------------------------------------------------------ */
  static register(context) {
    const provider = new _MarkdownEditorProvider(context);
    return vscode.window.registerCustomEditorProvider(
      _MarkdownEditorProvider.viewType,
      provider,
      { supportsMultipleEditorsPerDocument: false }
    );
  }
  /* ------------------------------------------------------------------ */
  /*  CustomTextEditorProvider                                           */
  /* ------------------------------------------------------------------ */
  async resolveCustomTextEditor(document, webviewPanel, _token) {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, "dist")]
    };
    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);
    const messageSubscription = webviewPanel.webview.onDidReceiveMessage(
      async (message) => {
        if (message.type === "ready") {
          webviewPanel.webview.postMessage({
            type: "init",
            content: document.getText()
          });
          return;
        }
        if (message.type !== "edit") {
          return;
        }
        const currentText = document.getText();
        if (message.content === currentText) {
          return;
        }
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(currentText.length)
        );
        const edit = new vscode.WorkspaceEdit();
        edit.replace(document.uri, fullRange, message.content);
        this.isApplyingEdit = true;
        try {
          await vscode.workspace.applyEdit(edit);
        } finally {
          this.isApplyingEdit = false;
        }
      }
    );
    const documentChangeSubscription = vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.uri.toString() !== document.uri.toString()) {
        return;
      }
      if (this.isApplyingEdit) {
        return;
      }
      webviewPanel.webview.postMessage({
        type: "update",
        content: document.getText()
      });
    });
    const saveSubscription = vscode.workspace.onDidSaveTextDocument((saved) => {
      if (saved.uri.toString() !== document.uri.toString()) {
        return;
      }
    });
    webviewPanel.onDidDispose(() => {
      messageSubscription.dispose();
      documentChangeSubscription.dispose();
      saveSubscription.dispose();
    });
  }
  /* ------------------------------------------------------------------ */
  /*  Webview HTML                                                       */
  /* ------------------------------------------------------------------ */
  getHtmlForWebview(webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, "dist", "webview.js")
    );
    const nonce = getNonce();
    return (
      /* html */
      `<!DOCTYPE html>
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
</html>`
    );
  }
};
function getNonce() {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = new Uint8Array(32);
  for (let i = 0; i < values.length; i++) {
    values[i] = Math.floor(Math.random() * possible.length);
  }
  return Array.from(values, (v) => possible[v]).join("");
}

// src/extension.ts
function activate(context) {
  context.subscriptions.push(MarkdownEditorProvider.register(context));
}
function deactivate() {
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
