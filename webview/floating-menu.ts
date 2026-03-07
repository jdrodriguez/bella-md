import { Editor } from '@tiptap/core';
import { requestPrompt } from './prompt-dialog';

/* ------------------------------------------------------------------ */
/*  Floating menu                                                      */
/* ------------------------------------------------------------------ */

interface FloatingMenuItem {
  icon: string;
  label: string;
  command: (editor: Editor) => void;
}

const FLOATING_MENU_ITEMS: FloatingMenuItem[] = [
  { icon: 'H1', label: 'Heading 1', command: (e) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { icon: 'H2', label: 'Heading 2', command: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { icon: 'H3', label: 'Heading 3', command: (e) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { icon: '\u2022', label: 'Bullet List', command: (e) => e.chain().focus().toggleBulletList().run() },
  { icon: '1.', label: 'Numbered List', command: (e) => e.chain().focus().toggleOrderedList().run() },
  { icon: '\u2611', label: 'Task List', command: (e) => e.chain().focus().toggleTaskList().run() },
  { icon: '\u201C', label: 'Blockquote', command: (e) => e.chain().focus().toggleBlockquote().run() },
  { icon: '<>', label: 'Code Block', command: (e) => e.chain().focus().toggleCodeBlock().run() },
  { icon: '\u2015', label: 'Divider', command: (e) => e.chain().focus().setHorizontalRule().run() },
  {
    icon: '\uD83D\uDDBC', label: 'Image', command: (e) => {
      requestPrompt('Image URL', 'https://').then((url) => {
        if (url) { e.chain().focus().setImage({ src: url }).run(); }
      });
    },
  },
];

export function createFloatingMenuElement(): HTMLElement {
  const el = document.createElement('div');
  el.className = 'floating-menu';
  return el;
}

export function populateFloatingMenu(floatingMenuEl: HTMLElement, editor: Editor): void {
  floatingMenuEl.innerHTML = '';

  for (const item of FLOATING_MENU_ITEMS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'floating-menu-item';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'floating-menu-item-icon';
    iconSpan.textContent = item.icon;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'floating-menu-item-label';
    labelSpan.textContent = item.label;

    button.appendChild(iconSpan);
    button.appendChild(labelSpan);

    button.addEventListener('mousedown', (ev) => ev.preventDefault());
    button.addEventListener('click', () => { item.command(editor); });

    floatingMenuEl.appendChild(button);
  }
}
