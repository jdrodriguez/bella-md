# BellaMD

A VSCode extension that replaces the default Markdown editor with a beautiful, TipTap-powered WYSIWYG editor. Open any `.md` file and get a rich text editing experience — no raw Markdown required.

## Features

- **Rich text editing** — Bold, italic, underline, strikethrough, headings, lists, blockquotes, tables, code blocks, and more
- **Toolbar & bubble menu** — Formatting controls appear in a persistent toolbar and a context-sensitive bubble menu on text selection
- **Syntax-highlighted code blocks** — Powered by lowlight with language auto-detection
- **Image support** — Paste images from clipboard, drag-and-drop files, and render local image paths
- **Find & replace** — Search within the document with case-sensitive toggle and replace-all
- **Emoji picker** — Insert emoji from a searchable picker
- **Color picker** — Apply text and highlight colors
- **Tables** — Create and edit tables with a right-click context menu for rows and columns
- **Frontmatter preservation** — YAML frontmatter is preserved on save without being rendered in the editor
- **Theme integration** — Follows your VSCode light, dark, and high-contrast themes
- **Keyboard shortcuts** — Cmd+B (bold), Cmd+I (italic), Cmd+U (underline), Cmd+Shift+S (strikethrough)
- **Large file protection** — Files over 500KB prompt to open in the default text editor

## Installation

### From VSIX

```bash
npm install
npm run build
npm run package
code --install-extension bella-md-*.vsix
```

### Development

```bash
npm install
npm run watch
```

Then press **F5** in VSCode to launch the Extension Development Host. Open any `.md` file — it will open in BellaMD.

## How It Works

BellaMD registers as a Custom Text Editor for `*.md` files. The extension has two parts:

1. **Extension host** — Manages the document lifecycle, handles file I/O, and bridges VSCode's text document model with the webview
2. **Webview** — A TipTap (ProseMirror) editor that renders Markdown as rich text and serializes edits back to Markdown

Content flows as: **Markdown → TipTap → Markdown**. The underlying `.md` file is always valid Markdown.

## Built With

- [TipTap v2](https://tiptap.dev/) — Rich text editor framework
- [tiptap-markdown](https://github.com/aguingand/tiptap-markdown) — Markdown serialization
- [lowlight](https://github.com/wooorm/lowlight) — Syntax highlighting
- [esbuild](https://esbuild.github.io/) — Bundler

## License

MIT
