# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A VSCode extension called BellaMD that replaces the default Markdown editor with a TipTap-powered WYSIWYG editor. When a user opens a `.md` file, they get a rich text editor instead of raw Markdown source. The extension registers as a Custom Text Editor (`bellaMD.markdownEditor`) for `*.md` files.

## Build Commands

```bash
npm run build        # Build both extension and webview bundles
npm run watch        # Watch mode for development
npm run type-check   # TypeScript type checking (tsc --noEmit)
npm run package      # Create .vsix package (vsce package --no-dependencies)
```

No test runner or linter is configured.

## Architecture

The extension has two separate bundles built by esbuild (configured in `esbuild.js`):

### Extension Host (Node.js, CJS)
- **Entry:** `src/extension.ts` — activates the extension, registers the editor provider
- **`src/markdownEditorProvider.ts`** — implements `CustomTextEditorProvider`. Creates the webview, injects the webview bundle, and handles the bidirectional message protocol between VSCode's text document and the webview

### Webview (Browser, IIFE)
- **Entry:** `webview/index.ts` — initializes the TipTap editor with all extensions, wires up the VSCode message API
- **Modules:** `toolbar.ts`, `bubble-menu.ts`, `floating-menu.ts`, `status-bar.ts`, `color-picker.ts`, `emoji-picker.ts`, `prompt-dialog.ts`, `styles.ts`, `utils.ts`

### Message Protocol (Extension <-> Webview)
| Direction | Type | Purpose |
|-----------|------|---------|
| Webview -> Extension | `ready` | Webview loaded, requests initial content |
| Extension -> Webview | `init` | Sends full document text |
| Extension -> Webview | `update` | External change to document (e.g. another editor) |
| Webview -> Extension | `edit` | User edited content, sends Markdown string |

The `isApplyingEdit` flag in the provider prevents echo loops when the webview's edit is applied back to the document. The webview uses `ignoreNextUpdate` for the same purpose on its side.

### Markdown Roundtrip
The `tiptap-markdown` extension handles conversion. Content flows as: **Markdown string -> TipTap (ProseMirror) -> Markdown string**. The webview reads Markdown via `editor.storage.markdown.getMarkdown()` and sends it back to the extension, which replaces the full document text.

### Styling
All CSS is in `webview/styles.ts` as a template literal, injected into the document head at runtime via `injectStyles()`. Styles use VSCode CSS custom properties (e.g. `--vscode-editor-background`) for theme integration, with light/dark/high-contrast theme support for syntax highlighting.

## Key Dependencies

- **TipTap v2** — rich text editor framework (wraps ProseMirror)
- **tiptap-markdown** — Markdown serialization/deserialization
- **lowlight** — syntax highlighting in code blocks (via `@tiptap/extension-code-block-lowlight`)

## Development Workflow

1. Run `npm run watch` for continuous rebuilds
2. Press F5 in VSCode to launch the Extension Development Host
3. Open any `.md` file in the dev host — it opens in the WYSIWYG editor
4. Output goes to `dist/extension.js` (Node) and `dist/webview.js` (browser)

## Webview Security

The webview uses a Content Security Policy with a nonce for scripts. Only `dist/` is in `localResourceRoots`. The `getNonce()` helper in `markdownEditorProvider.ts` generates the nonce.
