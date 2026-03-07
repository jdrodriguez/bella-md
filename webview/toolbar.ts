import { Editor } from '@tiptap/core';
import { requestPrompt } from './prompt-dialog';
import { createEmojiPicker } from './emoji-picker';
import { createColorPicker } from './color-picker';

/* ------------------------------------------------------------------ */
/*  Toolbar                                                            */
/* ------------------------------------------------------------------ */

export interface ToolbarButton {
  label: string;
  title: string;
  action: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
}

export interface ToolbarGroup {
  buttons: ToolbarButton[];
}

export function buildToolbarConfig(): ToolbarGroup[] {
  return [
    {
      buttons: [
        {
          label: 'B',
          title: 'Bold (Cmd+B)',
          action: (e) => e.chain().focus().toggleBold().run(),
          isActive: (e) => e.isActive('bold'),
        },
        {
          label: 'I',
          title: 'Italic (Cmd+I)',
          action: (e) => e.chain().focus().toggleItalic().run(),
          isActive: (e) => e.isActive('italic'),
        },
        {
          label: 'U',
          title: 'Underline (Cmd+U)',
          action: (e) => e.chain().focus().toggleUnderline().run(),
          isActive: (e) => e.isActive('underline'),
        },
        {
          label: 'S',
          title: 'Strikethrough (Cmd+Shift+S)',
          action: (e) => e.chain().focus().toggleStrike().run(),
          isActive: (e) => e.isActive('strike'),
        },
      ],
    },
    {
      buttons: [
        {
          label: 'Hi',
          title: 'Highlight',
          action: (e) => e.chain().focus().toggleHighlight().run(),
          isActive: (e) => e.isActive('highlight'),
        },
        {
          label: 'x\u00B2',
          title: 'Superscript',
          action: (e) => e.chain().focus().toggleSuperscript().run(),
          isActive: (e) => e.isActive('superscript'),
        },
        {
          label: 'x\u2082',
          title: 'Subscript',
          action: (e) => e.chain().focus().toggleSubscript().run(),
          isActive: (e) => e.isActive('subscript'),
        },
      ],
    },
    {
      buttons: [
        {
          label: 'H1',
          title: 'Heading 1',
          action: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: (e) => e.isActive('heading', { level: 1 }),
        },
        {
          label: 'H2',
          title: 'Heading 2',
          action: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: (e) => e.isActive('heading', { level: 2 }),
        },
        {
          label: 'H3',
          title: 'Heading 3',
          action: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: (e) => e.isActive('heading', { level: 3 }),
        },
      ],
    },
    {
      buttons: [
        {
          label: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="3" width="14" height="1.5" rx=".5"/><rect x="1" y="7.25" width="10" height="1.5" rx=".5"/><rect x="1" y="11.5" width="14" height="1.5" rx=".5"/></svg>',
          title: 'Align Left',
          action: (e) => e.chain().focus().setTextAlign('left').run(),
          isActive: (e) => e.isActive({ textAlign: 'left' }),
        },
        {
          label: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="3" width="14" height="1.5" rx=".5"/><rect x="3" y="7.25" width="10" height="1.5" rx=".5"/><rect x="1" y="11.5" width="14" height="1.5" rx=".5"/></svg>',
          title: 'Align Center',
          action: (e) => e.chain().focus().setTextAlign('center').run(),
          isActive: (e) => e.isActive({ textAlign: 'center' }),
        },
        {
          label: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="3" width="14" height="1.5" rx=".5"/><rect x="5" y="7.25" width="10" height="1.5" rx=".5"/><rect x="1" y="11.5" width="14" height="1.5" rx=".5"/></svg>',
          title: 'Align Right',
          action: (e) => e.chain().focus().setTextAlign('right').run(),
          isActive: (e) => e.isActive({ textAlign: 'right' }),
        },
      ],
    },
    {
      buttons: [
        {
          label: '\u2022',
          title: 'Bullet List',
          action: (e) => e.chain().focus().toggleBulletList().run(),
          isActive: (e) => e.isActive('bulletList'),
        },
        {
          label: '1.',
          title: 'Ordered List',
          action: (e) => e.chain().focus().toggleOrderedList().run(),
          isActive: (e) => e.isActive('orderedList'),
        },
        {
          label: '\u2611',
          title: 'Task List',
          action: (e) => e.chain().focus().toggleTaskList().run(),
          isActive: (e) => e.isActive('taskList'),
        },
      ],
    },
    {
      buttons: [
        {
          label: '\u201C',
          title: 'Blockquote',
          action: (e) => e.chain().focus().toggleBlockquote().run(),
          isActive: (e) => e.isActive('blockquote'),
        },
        {
          label: '{ }',
          title: 'Code Block',
          action: (e) => e.chain().focus().toggleCodeBlock().run(),
          isActive: (e) => e.isActive('codeBlock'),
        },
        {
          label: '\u2015',
          title: 'Horizontal Rule',
          action: (e) => e.chain().focus().setHorizontalRule().run(),
        },
      ],
    },
    {
      buttons: [
        {
          label: '\uD83D\uDD17',
          title: 'Insert Link',
          action: (e) => {
            const previousUrl = e.getAttributes('link').href as string | undefined;
            requestPrompt('URL', previousUrl ?? 'https://').then((url) => {
              if (url === null) return;
              if (url === '') {
                e.chain().focus().extendMarkRange('link').unsetLink().run();
                return;
              }
              e.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            });
          },
          isActive: (e) => e.isActive('link'),
        },
        {
          label: '\uD83D\uDDBC',
          title: 'Insert Image',
          action: (e) => {
            requestPrompt('Image URL', 'https://').then((url) => {
              if (url) {
                e.chain().focus().setImage({ src: url }).run();
              }
            });
          },
        },
      ],
    },
  ];
}

export function createToolbar(editor: Editor): HTMLElement {
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Formatting toolbar');

  const groups = buildToolbarConfig();
  const buttonElements: { el: HTMLButtonElement; isActive?: (e: Editor) => boolean }[] = [];

  for (const group of groups) {
    const groupEl = document.createElement('div');
    groupEl.className = 'toolbar-group';

    for (const btn of group.buttons) {
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML = btn.label;
      button.title = btn.title;
      button.setAttribute('aria-label', btn.title);

      button.addEventListener('mousedown', (e) => {
        e.preventDefault(); // prevent losing editor focus
      });

      button.addEventListener('click', () => {
        btn.action(editor);
      });

      groupEl.appendChild(button);
      buttonElements.push({ el: button, isActive: btn.isActive });
    }

    toolbar.appendChild(groupEl);
  }

  function updateActiveStates(): void {
    for (const { el, isActive } of buttonElements) {
      if (isActive) {
        el.classList.toggle('is-active', isActive(editor));
      }
    }
  }

  editor.on('selectionUpdate', updateActiveStates);
  editor.on('update', updateActiveStates);

  // Emoji picker (special — not a simple button)
  const emojiGroup = document.createElement('div');
  emojiGroup.className = 'toolbar-group';
  emojiGroup.appendChild(createEmojiPicker(editor));
  toolbar.appendChild(emojiGroup);

  // Color picker
  const colorGroup = document.createElement('div');
  colorGroup.className = 'toolbar-group';
  colorGroup.appendChild(createColorPicker(editor));
  toolbar.appendChild(colorGroup);

  return toolbar;
}
