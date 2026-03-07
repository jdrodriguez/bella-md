export const STYLES = /* css */ `
/* ---- Reset & base ------------------------------------------------ */
*, *::before, *::after {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--vscode-editor-background, #ffffff);
  color: var(--vscode-editor-foreground, #1e1e1e);
}

/* ---- Toolbar ----------------------------------------------------- */
.toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  padding: 6px 12px;
  background: var(--vscode-editor-background, #ffffff);
  border-bottom: 1px solid var(--vscode-panel-border, #e0e0e0);
  user-select: none;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.toolbar-group + .toolbar-group {
  margin-left: 4px;
  padding-left: 6px;
  border-left: 1px solid var(--vscode-panel-border, #e0e0e0);
}

.toolbar button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--vscode-editor-foreground, #1e1e1e);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.toolbar button:hover {
  background: var(--vscode-toolbar-hoverBackground, rgba(90, 93, 94, 0.12));
}

.toolbar button.is-active {
  background: var(--vscode-toolbar-activeBackground, rgba(90, 93, 94, 0.2));
  border-color: var(--vscode-focusBorder, rgba(0, 120, 212, 0.4));
}

.toolbar button:focus-visible {
  outline: 1px solid var(--vscode-focusBorder, #007acc);
  outline-offset: -1px;
}

/* ---- Editor wrapper ---------------------------------------------- */
.editor-scroll {
  overflow-y: auto;
  height: calc(100vh - 42px - 25px);
  scroll-behavior: smooth;
}

/* ---- ProseMirror (TipTap content area) --------------------------- */
.ProseMirror {
  --editor-gutter-width: 72px;
  --editor-badge-offset: 38px;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 48px 120px 96px;
  outline: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.7;
  color: var(--vscode-editor-foreground, #1e1e1e);
  caret-color: var(--vscode-editorCursor-foreground, #000000);
  counter-reset: editor-line;
}

/* ---- Line numbers ------------------------------------------------ */
.ProseMirror > :not(.ProseMirror-gapcursor) {
  position: relative;
  counter-increment: editor-line;
}
.ProseMirror > :not(.ProseMirror-gapcursor)::before {
  content: counter(editor-line);
  position: absolute;
  left: calc(-1 * var(--editor-gutter-width));
  width: 32px;
  top: 0;
  text-align: right;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 12px;
  line-height: inherit;
  color: var(--vscode-editorLineNumber-foreground, #858585);
  pointer-events: none;
  user-select: none;
}

/* Placeholder */
.ProseMirror p.is-editor-empty:first-child::before {
  content: 'Start writing...';
  float: left;
  height: 0;
  pointer-events: none;
  color: var(--vscode-editorGhostText-foreground, #999999);
  font-style: italic;
}

/* ---- Headings ---------------------------------------------------- */
.ProseMirror h1 {
  font-size: 2em;
  font-weight: 700;
  margin: 1.4em 0 0.6em;
  line-height: 1.25;
  border-bottom: 1px solid var(--vscode-panel-border, #e8e8e8);
  padding-bottom: 0.3em;
}

.ProseMirror h2 {
  font-size: 1.5em;
  font-weight: 600;
  margin: 1.3em 0 0.5em;
  line-height: 1.3;
}

.ProseMirror h3 {
  font-size: 1.25em;
  font-weight: 600;
  margin: 1.2em 0 0.4em;
  line-height: 1.35;
}

.ProseMirror h4,
.ProseMirror h5,
.ProseMirror h6 {
  font-size: 1em;
  font-weight: 600;
  margin: 1em 0 0.4em;
  line-height: 1.4;
}

.ProseMirror h1:first-child,
.ProseMirror h2:first-child,
.ProseMirror h3:first-child {
  margin-top: 0;
}

/* ---- Paragraphs -------------------------------------------------- */
.ProseMirror p {
  margin: 0 0 0.75em;
}

/* ---- Links ------------------------------------------------------- */
.ProseMirror a {
  color: var(--vscode-textLink-foreground, #0366d6);
  text-decoration: none;
}

.ProseMirror a:hover {
  text-decoration: underline;
}

/* ---- Bold / Italic / Strike -------------------------------------- */
.ProseMirror strong {
  font-weight: 600;
}

.ProseMirror em {
  font-style: italic;
}

.ProseMirror s {
  text-decoration: line-through;
  opacity: 0.65;
}

/* ---- Inline code ------------------------------------------------- */
.ProseMirror code {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas,
    'DejaVu Sans Mono', monospace;
  font-size: 0.875em;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  background: var(--vscode-textCodeBlock-background, rgba(27, 31, 35, 0.05));
  color: var(--vscode-editor-foreground, #1e1e1e);
}

/* ---- Code blocks ------------------------------------------------- */
.ProseMirror pre {
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas,
    'DejaVu Sans Mono', monospace;
  font-size: 0.875em;
  line-height: 1.55;
  background: var(--vscode-textCodeBlock-background, #f6f8fa);
  border-radius: 6px;
  padding: 16px 20px;
  margin: 1em 0;
  overflow-x: auto;
}

.ProseMirror pre code {
  background: none;
  padding: 0;
  border-radius: 0;
  font-size: inherit;
  color: inherit;
}

/* ---- Blockquotes ------------------------------------------------- */
.ProseMirror blockquote {
  margin: 1em 0;
  padding: 0.25em 0 0.25em 1.25em;
  border-left: 3px solid var(--vscode-textBlockQuote-border, #dfe2e5);
  color: var(--vscode-textBlockQuote-foreground, #6a737d);
}

.ProseMirror blockquote p {
  margin: 0.3em 0;
}

/* ---- Lists ------------------------------------------------------- */
.ProseMirror ul,
.ProseMirror ol {
  margin: 0.5em 0 1em;
  padding-left: 1.75em;
}

.ProseMirror li {
  margin: 0.25em 0;
}

.ProseMirror li > p {
  margin: 0.15em 0;
}

.ProseMirror li > ul,
.ProseMirror li > ol {
  margin: 0.15em 0;
}

/* ---- Task lists -------------------------------------------------- */
.ProseMirror ul[data-type="taskList"] {
  list-style: none;
  padding-left: 0;
}

.ProseMirror ul[data-type="taskList"] li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0.35em 0;
}

.ProseMirror ul[data-type="taskList"] li > label {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-top: 3px;
}

.ProseMirror ul[data-type="taskList"] li > label input[type="checkbox"] {
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: var(--vscode-textLink-foreground, #0366d6);
}

.ProseMirror ul[data-type="taskList"] li > div {
  flex: 1;
}

/* Nested task lists */
.ProseMirror ul[data-type="taskList"] ul[data-type="taskList"] {
  padding-left: 24px;
}

/* ---- Horizontal rule --------------------------------------------- */
.ProseMirror hr {
  border: none;
  border-top: 1px solid var(--vscode-panel-border, #e0e0e0);
  margin: 2em 0;
}

/* ---- Tables ------------------------------------------------------ */
.ProseMirror table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.ProseMirror th,
.ProseMirror td {
  border: 1px solid var(--vscode-panel-border, #dfe2e5);
  padding: 8px 12px;
  text-align: left;
}

.ProseMirror th {
  font-weight: 600;
  background: var(--vscode-textCodeBlock-background, #f6f8fa);
}

/* ---- Images ------------------------------------------------------ */
.ProseMirror img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

/* ---- Selections -------------------------------------------------- */
.ProseMirror ::selection {
  background: var(--vscode-editor-selectionBackground, rgba(0, 120, 215, 0.25));
}

/* ---- Gapcursor --------------------------------------------------- */
.ProseMirror .ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: relative;
}

.ProseMirror .ProseMirror-gapcursor::after {
  content: '';
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid var(--vscode-editor-foreground, #1e1e1e);
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to { visibility: hidden; }
}

/* ---- Highlight --------------------------------------------------- */
.ProseMirror mark {
  background-color: #fef08a;
  border-radius: 2px;
  padding: 0.1em 0;
}

/* ---- Text alignment ---------------------------------------------- */
.ProseMirror .has-text-align-center { text-align: center; }
.ProseMirror .has-text-align-right { text-align: right; }
.ProseMirror .has-text-align-justify { text-align: justify; }

/* ---- Superscript / Subscript ------------------------------------- */
.ProseMirror sup { font-size: 0.75em; vertical-align: super; }
.ProseMirror sub { font-size: 0.75em; vertical-align: sub; }

/* ---- Emoji picker ------------------------------------------------ */
.emoji-picker-wrapper {
  position: relative;
}

.emoji-picker {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  width: 320px;
  max-height: 340px;
  margin-top: 4px;
  background: var(--vscode-editor-background, #ffffff);
  border: 1px solid var(--vscode-panel-border, #e0e0e0);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.emoji-picker.is-open {
  display: flex;
  flex-direction: column;
}

.emoji-picker-search {
  padding: 8px;
  border-bottom: 1px solid var(--vscode-panel-border, #e0e0e0);
}

.emoji-picker-search input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--vscode-panel-border, #e0e0e0);
  border-radius: 4px;
  background: var(--vscode-input-background, #ffffff);
  color: var(--vscode-input-foreground, #1e1e1e);
  font-size: 13px;
  outline: none;
}

.emoji-picker-search input:focus {
  border-color: var(--vscode-focusBorder, #007acc);
}

.emoji-picker-tabs {
  display: flex;
  border-bottom: 1px solid var(--vscode-panel-border, #e0e0e0);
  padding: 0 4px;
  gap: 0;
}

.emoji-picker-tabs button {
  flex: 1;
  padding: 6px 0;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.15s, border-color 0.15s;
}

.emoji-picker-tabs button:hover {
  opacity: 0.8;
}

.emoji-picker-tabs button.is-active {
  opacity: 1;
  border-bottom-color: var(--vscode-focusBorder, #007acc);
}

.emoji-picker-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  padding: 8px;
  overflow-y: auto;
  flex: 1;
}

.emoji-picker-grid button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 4px;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  transition: background 0.1s;
}

.emoji-picker-grid button:hover {
  background: var(--vscode-toolbar-hoverBackground, rgba(90, 93, 94, 0.12));
}

/* ---- Color picker ------------------------------------------------ */
.color-picker-wrapper {
  position: relative;
}

.color-picker-trigger {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  line-height: 1;
}

.color-picker-trigger .color-label {
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
}

.color-picker-trigger .color-underline {
  width: 14px;
  height: 3px;
  border-radius: 1px;
  margin-top: 1px;
}

.color-picker-panel {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  margin-top: 4px;
  padding: 8px;
  background: var(--vscode-editor-background, #ffffff);
  border: 1px solid var(--vscode-panel-border, #e0e0e0);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.color-picker-panel.is-open {
  display: block;
}

.color-picker-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
}

.color-picker-grid button {
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s, border-color 0.15s;
}

.color-picker-grid button:hover {
  transform: scale(1.2);
  border-color: var(--vscode-focusBorder, #007acc);
}

.color-picker-grid button.is-active {
  border-color: var(--vscode-focusBorder, #007acc);
  box-shadow: 0 0 0 1px var(--vscode-focusBorder, #007acc);
}

/* ---- Status bar -------------------------------------------------- */
.status-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 16px;
  background: var(--vscode-editor-background, #ffffff);
  border-top: 1px solid var(--vscode-panel-border, #e0e0e0);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 11px;
  color: var(--vscode-descriptionForeground, #717171);
  user-select: none;
  z-index: 10;
}

.status-bar span + span::before {
  content: '|';
  margin: 0 8px;
  opacity: 0.5;
}

/* ---- Bubble menu ------------------------------------------------- */
.bubble-menu {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  background: var(--vscode-editor-background, #ffffff);
  border: 1px solid var(--vscode-panel-border, #e0e0e0);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bubble-menu button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: var(--vscode-editor-foreground, #1e1e1e);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.bubble-menu button:hover {
  background: var(--vscode-toolbar-hoverBackground, rgba(90, 93, 94, 0.12));
}

.bubble-menu button.is-active {
  background: var(--vscode-toolbar-activeBackground, rgba(90, 93, 94, 0.2));
  border-color: var(--vscode-focusBorder, rgba(0, 120, 212, 0.4));
}

/* ---- Code block syntax highlighting (lowlight) ------------------- */
.ProseMirror pre code .hljs-comment,
.ProseMirror pre code .hljs-quote {
  color: #6a737d;
  font-style: italic;
}

.ProseMirror pre code .hljs-keyword,
.ProseMirror pre code .hljs-selector-tag,
.ProseMirror pre code .hljs-deletion {
  color: #d73a49;
}

.ProseMirror pre code .hljs-string,
.ProseMirror pre code .hljs-number,
.ProseMirror pre code .hljs-regexp,
.ProseMirror pre code .hljs-literal,
.ProseMirror pre code .hljs-template-variable,
.ProseMirror pre code .hljs-addition {
  color: #032f62;
}

.ProseMirror pre code .hljs-title,
.ProseMirror pre code .hljs-section,
.ProseMirror pre code .hljs-title.function_ {
  color: #6f42c1;
}

.ProseMirror pre code .hljs-type,
.ProseMirror pre code .hljs-attr,
.ProseMirror pre code .hljs-attribute,
.ProseMirror pre code .hljs-variable,
.ProseMirror pre code .hljs-name {
  color: #005cc5;
}

.ProseMirror pre code .hljs-built_in,
.ProseMirror pre code .hljs-builtin-name,
.ProseMirror pre code .hljs-symbol,
.ProseMirror pre code .hljs-link,
.ProseMirror pre code .hljs-tag {
  color: #22863a;
}

.ProseMirror pre code .hljs-operator,
.ProseMirror pre code .hljs-meta,
.ProseMirror pre code .hljs-punctuation {
  color: #e36209;
}

.ProseMirror pre code .hljs-emphasis {
  font-style: italic;
}

.ProseMirror pre code .hljs-strong {
  font-weight: 700;
}

/* Dark theme overrides */
.vscode-dark .ProseMirror pre code .hljs-comment,
.vscode-dark .ProseMirror pre code .hljs-quote {
  color: #8b949e;
}

.vscode-dark .ProseMirror pre code .hljs-keyword,
.vscode-dark .ProseMirror pre code .hljs-selector-tag,
.vscode-dark .ProseMirror pre code .hljs-deletion {
  color: #ff7b72;
}

.vscode-dark .ProseMirror pre code .hljs-string,
.vscode-dark .ProseMirror pre code .hljs-number,
.vscode-dark .ProseMirror pre code .hljs-regexp,
.vscode-dark .ProseMirror pre code .hljs-literal,
.vscode-dark .ProseMirror pre code .hljs-template-variable,
.vscode-dark .ProseMirror pre code .hljs-addition {
  color: #a5d6ff;
}

.vscode-dark .ProseMirror pre code .hljs-title,
.vscode-dark .ProseMirror pre code .hljs-section,
.vscode-dark .ProseMirror pre code .hljs-title.function_ {
  color: #d2a8ff;
}

.vscode-dark .ProseMirror pre code .hljs-type,
.vscode-dark .ProseMirror pre code .hljs-attr,
.vscode-dark .ProseMirror pre code .hljs-attribute,
.vscode-dark .ProseMirror pre code .hljs-variable,
.vscode-dark .ProseMirror pre code .hljs-name {
  color: #79c0ff;
}

.vscode-dark .ProseMirror pre code .hljs-built_in,
.vscode-dark .ProseMirror pre code .hljs-builtin-name,
.vscode-dark .ProseMirror pre code .hljs-symbol,
.vscode-dark .ProseMirror pre code .hljs-link,
.vscode-dark .ProseMirror pre code .hljs-tag {
  color: #7ee787;
}

.vscode-dark .ProseMirror pre code .hljs-operator,
.vscode-dark .ProseMirror pre code .hljs-meta,
.vscode-dark .ProseMirror pre code .hljs-punctuation {
  color: #ffa657;
}

/* High-contrast theme overrides */
.vscode-high-contrast .ProseMirror pre code .hljs-comment,
.vscode-high-contrast .ProseMirror pre code .hljs-quote {
  color: #9da5b4;
  font-style: italic;
}

.vscode-high-contrast .ProseMirror pre code .hljs-keyword,
.vscode-high-contrast .ProseMirror pre code .hljs-selector-tag,
.vscode-high-contrast .ProseMirror pre code .hljs-deletion {
  color: #ff6b6b;
}

.vscode-high-contrast .ProseMirror pre code .hljs-string,
.vscode-high-contrast .ProseMirror pre code .hljs-number,
.vscode-high-contrast .ProseMirror pre code .hljs-regexp,
.vscode-high-contrast .ProseMirror pre code .hljs-literal,
.vscode-high-contrast .ProseMirror pre code .hljs-template-variable,
.vscode-high-contrast .ProseMirror pre code .hljs-addition {
  color: #b5deff;
}

/* ---- Floating menu (slash commands) ------------------------------ */
.floating-menu {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  max-height: 320px;
  overflow-y: auto;
  background: var(--vscode-editorWidget-background, #ffffff);
  border: 1px solid var(--vscode-editorWidget-border, var(--vscode-panel-border, #e0e0e0));
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 4px;
  z-index: 50;
}

.floating-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--vscode-editor-foreground, #1e1e1e);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  transition: background 0.1s;
  line-height: 1.4;
}

.floating-menu-item:hover {
  background: var(--vscode-list-hoverBackground, rgba(90, 93, 94, 0.12));
}

.floating-menu-item:focus-visible {
  outline: 1px solid var(--vscode-focusBorder, #007acc);
  outline-offset: -1px;
}

.floating-menu-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  font-size: 14px;
  color: var(--vscode-descriptionForeground, #717171);
  border-radius: 4px;
  background: var(--vscode-textCodeBlock-background, rgba(27, 31, 35, 0.05));
}

.floating-menu-item-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---- Prompt dialog ----------------------------------------------- */
.prompt-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.prompt-dialog {
  background: var(--vscode-editor-background, #1e1e1e);
  border: 1px solid var(--vscode-widget-border, #454545);
  border-radius: 6px;
  padding: 16px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}
.prompt-label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  color: var(--vscode-foreground, #ccc);
}
.prompt-input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 8px;
  font-size: 13px;
  font-family: inherit;
  border: 1px solid var(--vscode-input-border, #3c3c3c);
  background: var(--vscode-input-background, #3c3c3c);
  color: var(--vscode-input-foreground, #ccc);
  border-radius: 4px;
  outline: none;
}
.prompt-input:focus {
  border-color: var(--vscode-focusBorder, #007fd4);
}
.prompt-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}
.prompt-btn {
  padding: 5px 14px;
  font-size: 13px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
.prompt-btn-cancel {
  background: transparent;
  color: var(--vscode-foreground, #ccc);
  border: 1px solid var(--vscode-widget-border, #454545);
}
.prompt-btn-cancel:hover {
  background: var(--vscode-toolbar-hoverBackground, rgba(90, 93, 94, 0.31));
}
.prompt-btn-ok {
  background: var(--vscode-button-background, #0e639c);
  color: var(--vscode-button-foreground, #fff);
}
.prompt-btn-ok:hover {
  background: var(--vscode-button-hoverBackground, #1177bb);
}

/* ---- Active line highlight ----------------------------------------- */
.ProseMirror .active-line {
  background: var(--vscode-editor-lineHighlightBackground, rgba(0, 0, 0, 0.04));
  border-radius: 2px;
}
.vscode-dark .ProseMirror .active-line {
  background: var(--vscode-editor-lineHighlightBackground, rgba(255, 255, 255, 0.04));
}

/* ---- Heading level badges ------------------------------------------ */
.heading-badge {
  position: absolute;
  left: calc(-1 * var(--editor-badge-offset));
  top: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 20px;
  padding: 0 4px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
  font-size: 10px;
  font-weight: 600;
  color: var(--vscode-editorLineNumber-foreground, #858585);
  background: var(--vscode-textCodeBlock-background, rgba(27, 31, 35, 0.05));
  border-radius: 3px;
  pointer-events: none;
  user-select: none;
}

/* ---- Search bar ---------------------------------------------------- */
.search-bar {
  display: none;
  position: fixed;
  top: 42px;
  right: 16px;
  z-index: 100;
  background: var(--vscode-editorWidget-background, #ffffff);
  border: 1px solid var(--vscode-editorWidget-border, #e0e0e0);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  padding: 8px 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
}
.search-bar.is-open { display: flex; flex-direction: column; gap: 6px; }
.search-bar-row { display: flex; align-items: center; gap: 4px; }
.search-bar input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid var(--vscode-input-border, #ccc);
  border-radius: 4px;
  background: var(--vscode-input-background, #fff);
  color: var(--vscode-input-foreground, #1e1e1e);
  font-size: 13px;
  outline: none;
  min-width: 180px;
}
.search-bar input:focus { border-color: var(--vscode-focusBorder, #007acc); }
.search-bar button {
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--vscode-editor-foreground, #1e1e1e);
  cursor: pointer;
  font-size: 12px;
}
.search-bar button:hover { background: var(--vscode-toolbar-hoverBackground, rgba(90, 93, 94, 0.12)); }
.search-bar button.is-active { background: var(--vscode-toolbar-activeBackground, rgba(90, 93, 94, 0.2)); }
.search-bar .match-count { font-size: 11px; color: var(--vscode-descriptionForeground, #717171); white-space: nowrap; padding: 0 4px; }
.ProseMirror .search-match { background: rgba(255, 200, 0, 0.4); border-radius: 2px; }
.ProseMirror .search-match-current { background: rgba(255, 150, 0, 0.6); border-radius: 2px; }

/* ---- Table context menu -------------------------------------------- */
.table-context-menu {
  display: none;
  position: fixed;
  z-index: 200;
  min-width: 180px;
  background: var(--vscode-editorWidget-background, #ffffff);
  border: 1px solid var(--vscode-editorWidget-border, #e0e0e0);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 13px;
}
.table-context-menu.is-open { display: block; }
.table-context-menu-item {
  display: block;
  width: 100%;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--vscode-editor-foreground, #1e1e1e);
  text-align: left;
  cursor: pointer;
  font-size: 13px;
}
.table-context-menu-item:hover {
  background: var(--vscode-list-hoverBackground, rgba(90, 93, 94, 0.12));
}
.table-context-menu-separator {
  height: 1px;
  margin: 4px 8px;
  background: var(--vscode-panel-border, #e0e0e0);
}

/* ---- GitHub-style alerts ------------------------------------------- */
.ProseMirror .github-alert {
  border-left-width: 4px;
  border-radius: 6px;
  padding: 12px 16px;
  margin: 1em 0;
}
.ProseMirror .github-alert-note {
  border-left-color: #0969da;
  background: rgba(9, 105, 218, 0.08);
}
.ProseMirror .github-alert-tip {
  border-left-color: #1a7f37;
  background: rgba(26, 127, 55, 0.08);
}
.ProseMirror .github-alert-important {
  border-left-color: #8250df;
  background: rgba(130, 80, 223, 0.08);
}
.ProseMirror .github-alert-warning {
  border-left-color: #9a6700;
  background: rgba(154, 103, 0, 0.08);
}
.ProseMirror .github-alert-caution {
  border-left-color: #cf222e;
  background: rgba(207, 34, 46, 0.08);
}
/* Dark theme */
.vscode-dark .ProseMirror .github-alert-note {
  border-left-color: #4493f8;
  background: rgba(68, 147, 248, 0.1);
}
.vscode-dark .ProseMirror .github-alert-tip {
  border-left-color: #3fb950;
  background: rgba(63, 185, 80, 0.1);
}
.vscode-dark .ProseMirror .github-alert-important {
  border-left-color: #a371f7;
  background: rgba(163, 113, 247, 0.1);
}
.vscode-dark .ProseMirror .github-alert-warning {
  border-left-color: #d29922;
  background: rgba(210, 153, 34, 0.1);
}
.vscode-dark .ProseMirror .github-alert-caution {
  border-left-color: #f85149;
  background: rgba(248, 81, 73, 0.1);
}

/* ---- Code block language selector ---------------------------------- */
.code-block-lang-selector {
  position: absolute;
  top: 4px;
  right: 4px;
  z-index: 5;
}
.code-block-lang-selector select {
  padding: 2px 6px;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 11px;
  border: 1px solid var(--vscode-panel-border, #e0e0e0);
  border-radius: 4px;
  background: var(--vscode-editorWidget-background, #f6f8fa);
  color: var(--vscode-editor-foreground, #1e1e1e);
  cursor: pointer;
  outline: none;
  opacity: 0.6;
  transition: opacity 0.15s;
}
.code-block-lang-selector select:hover,
.code-block-lang-selector select:focus {
  opacity: 1;
  border-color: var(--vscode-focusBorder, #007acc);
}
.ProseMirror pre {
  position: relative;
}
`;

export function injectStyles(): void {
  const style = document.createElement('style');
  style.textContent = STYLES;
  document.head.appendChild(style);
}
