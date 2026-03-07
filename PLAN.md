# md-ext Improvement Plan

**Date:** 2026-03-07
**Based on:** Review of Simple Markdown Editor (mech2cs) and TUI Milkdown (tuanhv)

---

## Phase 1: Foundation & Stability

These are low-effort, high-impact changes that fix fundamental gaps in the extension's reliability and UX. No new features — just making what we have work properly.

### 1.1 — Retain Webview Context When Hidden

**Problem:** Every time the user switches tabs, the webview is destroyed and recreated. They lose scroll position, undo history, and the editor flashes on return.

**Solution:** Add `retainContextWhenHidden: true` to the `registerCustomEditorProvider` options in `markdownEditorProvider.ts`.

**Files:** `src/markdownEditorProvider.ts`

---

### 1.2 — Git/Diff Editor Exclusion

**Problem:** Our editor opens for `.md` files in git diff views, source control panels, and GitLens — places where raw markdown should be shown.

**Solution:** Add `configurationDefaults` to `package.json` that maps `git:/**/*.md` and `gitlens:/**/*.md` to the default text editor.

**Files:** `package.json`

---

### 1.3 — Large File Guard

**Problem:** Opening a 2MB markdown file in a WYSIWYG editor will freeze the webview. No protection against this.

**Solution:** In `resolveCustomTextEditor`, check `document.getText().length`. If >500KB, show a warning dialog with an option to open in the default text editor instead. Use `vscode.commands.executeCommand('vscode.openWith', document.uri, 'default')` for fallback.

**Files:** `src/markdownEditorProvider.ts`

---

### 1.4 — IME Composition Guards

**Problem:** CJK (Chinese, Japanese, Korean) input uses IME composition. During composition, intermediate characters are inserted and our debounced `onUpdate` fires, sending partial/garbled content to the extension host. This corrupts the document.

**Solution:** Track `compositionstart` and `compositionend` events in the webview. While composing, suppress the debounced send. On `compositionend`, allow the next update to fire normally.

**Files:** `webview/index.ts`

---

### 1.5 — Stronger Echo Prevention

**Problem:** Our current echo prevention uses a simple `isApplyingEdit` boolean flag in the extension and `ignoreNextUpdate` in the webview. These are fragile — a race condition or an async gap can cause them to miss, creating infinite update loops.

**Solution:** Replace with a content fingerprint approach. Before sending an edit to the extension, hash the content string. When the extension sends an `update` back, compare its content hash against the last sent hash. If they match, it's an echo — skip it. Same pattern on the extension side.

**Files:** `src/markdownEditorProvider.ts`, `webview/index.ts`

---

## Phase 2: Keybindings & Editor Polish

Small UX improvements that make the editor feel like a real editor, not a prototype.

### 2.1 — Keybinding Overrides

**Problem:** When our editor is focused, Cmd+B toggles the sidebar instead of bolding text. Cmd+I opens IntelliSense instead of italicizing. These are the most basic formatting shortcuts and they don't work.

**Solution:** Add `keybindings` entries in `package.json` that rebind Cmd+B, Cmd+I, Cmd+U, and Cmd+Shift+S to extension commands when `activeCustomEditorId == 'mdExt.markdownEditor'`. Register those commands in `extension.ts` and forward them to the webview as `command` messages.

**Files:** `package.json`, `src/extension.ts`, `src/markdownEditorProvider.ts`, `webview/index.ts`

---

### 2.2 — Current Line Highlight

**Problem:** There's no visual indicator of which block the cursor is in. In a long document, the user loses track of their position.

**Solution:** Add a ProseMirror plugin that finds the top-level node containing the cursor and applies a `line-highlight` CSS class via node decoration. Handle list items by highlighting only the current item, not the whole list.

**Files:** `webview/index.ts` (new plugin), `webview/styles.ts`

---

### 2.3 — Heading Level Badges

**Problem:** Headings are visually distinct by size, but when scrolling through a long document it's not immediately clear what level a heading is — especially H3 vs H4 vs H5.

**Solution:** Add a ProseMirror plugin that inserts widget decorations (small "H1", "H2", etc. labels) positioned to the left of each heading, in the line number gutter area.

**Files:** `webview/index.ts` (new plugin), `webview/styles.ts`

---

## Phase 3: Image File Handling

This is the biggest gap. Both competitor extensions have robust image handling. Ours only supports URL-based images.

### 3.1 — Clipboard Image Paste

**Problem:** Users can't paste screenshots into the editor. This is the #1 expected feature in any WYSIWYG markdown editor.

**Solution:**
1. In the webview, intercept `paste` events on the editor. If the clipboard contains image data (`clipboardData.items` with `type: image/*`), read it as base64.
2. Immediately insert the base64 image into TipTap for instant preview.
3. Send a `pasteImage` message to the extension with the base64 data.
4. In the extension, save the image to a configurable directory (default: same directory as the `.md` file) with a timestamped filename.
5. Send the saved relative path back to the webview.
6. In the webview, surgically replace the base64 `src` with the relative path using ProseMirror's `replaceWith`.

**Files:** `src/markdownEditorProvider.ts` (new file handler), `webview/index.ts`, new `webview/image-handler.ts`

---

### 3.2 — Drag-and-Drop Image Files

**Problem:** Users can't drag image files into the editor.

**Solution:** Same pipeline as 3.1, but triggered by the `drop` event. Read dropped files via `FileReader`, send base64 to extension, save to disk, return relative path.

**Files:** `webview/index.ts` or `webview/image-handler.ts`, `src/markdownEditorProvider.ts`

---

### 3.3 — Image Path Resolution

**Problem:** Local image paths in markdown (e.g., `![](./images/photo.png)`) don't render in the webview because the webview can't access local files directly.

**Solution:** Before sending content to the webview, resolve relative image paths to webview-safe URIs using `webview.asWebviewUri()`. Before saving back to disk, convert webview URIs back to relative paths. Maintain a bidirectional path map.

**Files:** `src/markdownEditorProvider.ts`, `webview/index.ts`

---

## Phase 4: Advanced Features

Nice-to-have features that differentiate our editor. Lower priority, higher effort.

### 4.1 — Find and Replace

**Problem:** No way to search within the document. Cmd+F does nothing.

**Solution:** Build a find/replace bar (similar to VSCode's native one). Use ProseMirror's `Decoration.inline` to highlight matches. Support case-sensitive toggle, navigate between matches, replace, replace-all.

**Files:** New `webview/search.ts`, `webview/styles.ts`, `webview/index.ts`

---

### 4.2 — GitHub-Style Alerts

**Problem:** GitHub-flavored markdown supports `> [!NOTE]`, `> [!WARNING]`, etc. These are increasingly common but render as plain blockquotes in our editor.

**Solution:** Create a custom TipTap node extension that detects alert syntax during markdown parsing and renders them as styled, colored blocks with appropriate icons.

**Files:** New `webview/extensions/alert.ts`, `webview/styles.ts`, `webview/index.ts`

---

### 4.3 — YAML Frontmatter Support

**Problem:** Frontmatter (`---...---`) at the top of a markdown file is rendered as regular content, which looks broken.

**Solution:** Create a custom TipTap node extension for frontmatter. Parse it as a collapsible block that shows the YAML in a monospace textarea. Exclude it from the main editor flow.

**Files:** New `webview/extensions/frontmatter.ts`, `webview/styles.ts`, `webview/index.ts`

---

### 4.4 — Table Context Menu

**Problem:** Users can create tables via the toolbar, but there's no way to add/delete rows or columns without knowing keyboard shortcuts.

**Solution:** Intercept `contextmenu` events on table cells. Show a dropdown with: Insert Row Above, Insert Row Below, Insert Column Left, Insert Column Right, Delete Row, Delete Column, Delete Table.

**Files:** New `webview/table-menu.ts`, `webview/styles.ts`, `webview/index.ts`

---

### 4.5 — Code Block Language Selector

**Problem:** Code blocks have syntax highlighting via lowlight, but users can't select or change the language. They must type the language name in raw markdown.

**Solution:** Create a custom NodeView for code blocks that includes a dropdown selector in the top-right corner. Populate it with the languages registered in lowlight. Remember the last selected language and auto-apply to new code blocks.

**Files:** New `webview/extensions/code-block-view.ts`, `webview/styles.ts`, `webview/index.ts`

---

## Execution Order

```
Phase 1 (Foundation)     → All tasks can be parallelized
Phase 2 (Polish)         → All tasks can be parallelized
Phase 3 (Images)         → 3.3 first, then 3.1 and 3.2 in parallel
Phase 4 (Advanced)       → All tasks are independent
```

## Out of Scope

These were observed in the competitor extensions but are not worth pursuing now:

- **Mermaid diagrams** — Adds ~11MB to the bundle. Niche use case.
- **Math/KaTeX** — Complex to implement well. Niche use case.
- **Split source/WYSIWYG view** — Significant complexity. The "View Source" toggle (open in default editor) is simpler and sufficient.
- **Custom color themes** — VSCode theme integration via CSS variables is better than shipping 10 custom themes.
- **Incremental document diffs** — Both competitors do full document replacement. The complexity of computing and applying diffs isn't justified yet.
