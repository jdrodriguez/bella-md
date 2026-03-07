declare function acquireVsCodeApi(): {
  postMessage(msg: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
};

import { Editor, Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { Markdown } from 'tiptap-markdown';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import CharacterCount from '@tiptap/extension-character-count';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import FloatingMenu from '@tiptap/extension-floating-menu';

import { injectStyles } from './styles';
import { createToolbar } from './toolbar';
import { createBubbleMenuElement, setupBubbleMenuActions } from './bubble-menu';
import { createFloatingMenuElement, populateFloatingMenu } from './floating-menu';
import { createStatusBar } from './status-bar';
import { setupTableContextMenu, setupTableControls } from './table-menu';
import { debounce } from './utils';
import { createSearchBar, setupSearchKeybinding, createSearchExtension } from './search';
import { GitHubAlerts } from './extensions/alert';
import { CodeBlockLanguageSelector } from './extensions/code-block-view';

const vscode = acquireVsCodeApi();
const lowlight = createLowlight(common);

function main(): void {
  injectStyles();

  let lastExtensionContentHash = '';

  function hashContent(content: string): string {
    let hash = 5381;
    for (let i = 0; i < content.length; i++) {
      hash = ((hash << 5) + hash + content.charCodeAt(i)) & 0xffffffff;
    }
    return hash.toString(36);
  }

  let isComposing = false;

  const editorMount = document.getElementById('editor');
  if (!editorMount) {
    throw new Error('Could not find #editor element');
  }

  // Create the scrollable wrapper and toolbar host
  const toolbar = document.createElement('div');
  toolbar.id = 'toolbar-mount';

  const scrollContainer = document.createElement('div');
  scrollContainer.className = 'editor-scroll';

  const contentHost = document.createElement('div');
  contentHost.id = 'editor-content';
  contentHost.style.position = 'relative';

  const gutterEl = document.createElement('div');
  gutterEl.className = 'line-gutter';

  contentHost.appendChild(gutterEl);
  scrollContainer.appendChild(contentHost);

  editorMount.appendChild(toolbar);
  editorMount.appendChild(scrollContainer);

  // Create bubble menu & floating menu elements BEFORE Editor instantiation
  const bubbleMenuEl = createBubbleMenuElement();
  document.body.appendChild(bubbleMenuEl);

  const floatingMenuEl = createFloatingMenuElement();
  document.body.appendChild(floatingMenuEl);

  const ActiveLineHighlight = Extension.create({
    name: 'activeLineHighlight',
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('activeLineHighlight'),
          props: {
            decorations(state) {
              const { $head } = state.selection;
              const depth = $head.depth;
              if (depth === 0) return DecorationSet.empty;

              const topPos = $head.start(1) - 1;
              const topNode = state.doc.nodeAt(topPos);
              if (!topNode) return DecorationSet.empty;

              const decoration = Decoration.node(topPos, topPos + topNode.nodeSize, {
                class: 'active-line',
              });
              return DecorationSet.create(state.doc, [decoration]);
            },
          },
        }),
      ];
    },
  });


  let debouncedSendUpdate: () => void;

  const editor = new Editor({
    element: contentHost,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer nofollow',
        },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Typography,
      Superscript,
      Subscript,
      TextStyle,
      Color,
      CharacterCount,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: true, allowBase64: true }),
      Table.configure({
        resizable: false,
        HTMLAttributes: { class: 'md-table' },
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Markdown.configure({
        html: true,
        transformCopiedText: false,
        transformPastedText: true,
      }),
      BubbleMenu.configure({
        element: bubbleMenuEl,
      }),
      FloatingMenu.configure({
        element: floatingMenuEl,
        tippyOptions: {
          placement: 'bottom-start',
          offset: [0, 4],
        },
      }),
      ActiveLineHighlight,
      GitHubAlerts,
      CodeBlockLanguageSelector,
      createSearchExtension(),
    ],
    editorProps: {
      attributes: {
        spellcheck: 'true',
      },
    },
    onUpdate: () => {
      if (isComposing) return;
      debouncedSendUpdate();
    },
  });

  // IME composition guards — suppress updates during CJK input
  editor.view.dom.addEventListener('compositionstart', () => {
    isComposing = true;
  });
  editor.view.dom.addEventListener('compositionend', () => {
    isComposing = false;
    // Fire the debounced update now that composition is complete
    debouncedSendUpdate();
  });

  // --- Clipboard image paste -------------------------------------------
  editor.view.dom.addEventListener('paste', (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (!item.type.startsWith('image/')) continue;

      event.preventDefault();
      const file = item.getAsFile();
      if (!file) continue;

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // Insert base64 image for instant preview
        editor.chain().focus().setImage({ src: dataUrl }).run();
        // Ask extension to save to disk
        const ext = file.type.split('/')[1] || 'png';
        vscode.postMessage({
          type: 'pasteImage',
          data: dataUrl,
          ext,
        });
      };
      reader.readAsDataURL(file);
      break; // handle one image at a time
    }
  });

  // --- Drag-and-drop image files ---------------------------------------
  editor.view.dom.addEventListener('dragover', (event: DragEvent) => {
    event.preventDefault();
  });

  editor.view.dom.addEventListener('drop', (event: DragEvent) => {
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;

      event.preventDefault();
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // Insert base64 image for instant preview
        editor.chain().focus().setImage({ src: dataUrl }).run();
        // Ask extension to save to disk (reuses pasteImage handler)
        const ext = file.type.split('/')[1] || 'png';
        vscode.postMessage({
          type: 'pasteImage',
          data: dataUrl,
          ext,
        });
      };
      reader.readAsDataURL(file);
      break; // handle one image at a time
    }
  });

  // Build and mount the toolbar
  const toolbarEl = createToolbar(editor);
  toolbar.appendChild(toolbarEl);

  // Wire up bubble menu, floating menu, and status bar
  setupBubbleMenuActions(bubbleMenuEl, editor);
  populateFloatingMenu(floatingMenuEl, editor);
  setupTableContextMenu(editor);
  setupTableControls(editor);

  const statusBar = createStatusBar(editor);
  editorMount.appendChild(statusBar);

  // --- Line numbers gutter -------------------------------------------
  const lineInfoEl = document.createElement('span');
  lineInfoEl.textContent = 'Ln 1';
  statusBar.appendChild(lineInfoEl);

  function updateLineNumbers(): void {
    const proseMirrorEl = contentHost.querySelector('.ProseMirror') as HTMLElement | null;
    if (!proseMirrorEl) return;

    // Get the full markdown and split into lines
    const md = (editor.storage.markdown as { getMarkdown: () => string }).getMarkdown();
    const lines = md.split('\n');

    // Build a map: for each block, find its starting source line.
    // Markdown blocks are separated by blank lines. Walk the lines and
    // record the start of each non-blank run (= one block).
    const blockLineStarts: number[] = [];
    let inBlock = false;
    for (let i = 0; i < lines.length; i++) {
      const blank = lines[i].trim() === '';
      if (!blank && !inBlock) {
        blockLineStarts.push(i + 1); // 1-based
        inBlock = true;
      } else if (blank) {
        inBlock = false;
      }
    }

    // Collect top-level DOM nodes
    const topNodes: HTMLElement[] = [];
    for (const child of Array.from(proseMirrorEl.children)) {
      if (child instanceof HTMLElement && !child.classList.contains('ProseMirror-gapcursor')) {
        topNodes.push(child);
      }
    }

    // Build gutter content
    gutterEl.innerHTML = '';
    const contentHostRect = contentHost.getBoundingClientRect();
    const proseMirrorRect = proseMirrorEl.getBoundingClientRect();
    // Position line numbers at the left edge of ProseMirror's padding
    const gutterLeft = proseMirrorRect.left - contentHostRect.left + 8;

    for (let i = 0; i < topNodes.length; i++) {
      const domNode = topNodes[i];
      const lineNum = i < blockLineStarts.length ? blockLineStarts[i] : '';
      const nodeRect = domNode.getBoundingClientRect();
      const topOffset = nodeRect.top - contentHostRect.top;

      const lineEl = document.createElement('div');
      lineEl.className = 'line-number';
      lineEl.textContent = String(lineNum);
      lineEl.style.top = `${topOffset}px`;
      lineEl.style.left = `${gutterLeft}px`;
      gutterEl.appendChild(lineEl);
    }

    // Update status bar with current cursor line
    const { $head } = editor.state.selection;
    if ($head.depth > 0) {
      const topNodePos = $head.start(1) - 1;
      const doc = editor.state.doc;
      let topIndex = 0;
      let pos = 0;
      for (let i = 0; i < doc.childCount; i++) {
        if (pos === topNodePos) {
          topIndex = i;
          break;
        }
        pos += doc.child(i).nodeSize;
      }
      if (topIndex < blockLineStarts.length) {
        lineInfoEl.textContent = `Ln ${blockLineStarts[topIndex]}`;
      }
    }
  }

  editor.on('update', updateLineNumbers);
  editor.on('selectionUpdate', updateLineNumbers);
  requestAnimationFrame(updateLineNumbers);

  const searchBar = createSearchBar(editor);
  document.body.appendChild(searchBar);
  setupSearchKeybinding(editor, searchBar);

  // Debounced sender to avoid flooding the extension with messages
  debouncedSendUpdate = debounce(() => {
    const md = (editor.storage.markdown as { getMarkdown: () => string }).getMarkdown();
    if (hashContent(md) === lastExtensionContentHash) {
      return;
    }
    vscode.postMessage({ type: 'edit', content: md });
  }, 300);

  // Signal the extension that the webview is ready to receive content.
  vscode.postMessage({ type: 'ready' });

  window.addEventListener('message', (event: MessageEvent) => {
    const msg = event.data as { type: string; content?: string };

    switch (msg.type) {
      case 'init': {
        if (typeof msg.content === 'string') {
          lastExtensionContentHash = hashContent(msg.content);
          editor.commands.setContent(msg.content);
          requestAnimationFrame(updateLineNumbers);
        }
        break;
      }

      case 'update': {
        if (typeof msg.content === 'string') {
          const { from, to } = editor.state.selection;
          lastExtensionContentHash = hashContent(msg.content);
          editor.commands.setContent(msg.content);

          const docLength = editor.state.doc.content.size;
          const safeFrom = Math.min(from, docLength);
          const safeTo = Math.min(to, docLength);

          try {
            editor.commands.setTextSelection({ from: safeFrom, to: safeTo });
          } catch {
            // Selection restoration is best-effort
          }
        }
        break;
      }

      case 'imageSaved': {
        const { tempSrc, savedSrc } = msg as unknown as { type: string; tempSrc: string; savedSrc: string };
        // Find the image with the temp base64 src and replace with saved path
        const { doc, tr } = editor.state;
        let found = false;
        doc.descendants((node, pos) => {
          if (found) return false;
          if (node.type.name === 'image' && node.attrs.src === tempSrc) {
            tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: savedSrc });
            found = true;
            return false;
          }
          return true;
        });
        if (found) {
          editor.view.dispatch(tr);
        }
        break;
      }

      case 'command': {
        const cmd = (msg as { type: string; command: string }).command;
        switch (cmd) {
          case 'toggleBold':
            editor.chain().focus().toggleBold().run();
            break;
          case 'toggleItalic':
            editor.chain().focus().toggleItalic().run();
            break;
          case 'toggleUnderline':
            editor.chain().focus().toggleUnderline().run();
            break;
          case 'toggleStrikethrough':
            editor.chain().focus().toggleStrike().run();
            break;
        }
        break;
      }
    }
  });
}

main();
