import { Editor } from '@tiptap/core';

/* ------------------------------------------------------------------ */
/*  Bubble menu                                                        */
/* ------------------------------------------------------------------ */

interface BubbleMenuButton {
  label: string;
  title: string;
  style?: string;
  command: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
}

const BUBBLE_MENU_BUTTONS: BubbleMenuButton[] = [
  {
    label: 'B', title: 'Bold', style: 'font-weight:700',
    command: (e) => { e.chain().focus().toggleBold().run(); },
    isActive: (e) => e.isActive('bold'),
  },
  {
    label: 'I', title: 'Italic', style: 'font-style:italic',
    command: (e) => { e.chain().focus().toggleItalic().run(); },
    isActive: (e) => e.isActive('italic'),
  },
  {
    label: 'U', title: 'Underline', style: 'text-decoration:underline',
    command: (e) => { e.chain().focus().toggleUnderline().run(); },
    isActive: (e) => e.isActive('underline'),
  },
  {
    label: 'S', title: 'Strikethrough', style: 'text-decoration:line-through',
    command: (e) => { e.chain().focus().toggleStrike().run(); },
    isActive: (e) => e.isActive('strike'),
  },
];

export function createBubbleMenuElement(): HTMLElement {
  const menuEl = document.createElement('div');
  menuEl.className = 'bubble-menu';

  for (const def of BUBBLE_MENU_BUTTONS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = def.label;
    btn.title = def.title;
    btn.setAttribute('aria-label', def.title);
    btn.dataset.command = def.title.toLowerCase();
    if (def.style) {
      btn.style.cssText = def.style;
    }
    btn.addEventListener('mousedown', (ev) => ev.preventDefault());
    menuEl.appendChild(btn);
  }

  return menuEl;
}

export function setupBubbleMenuActions(menuEl: HTMLElement, editor: Editor): void {
  const buttons = menuEl.querySelectorAll('button');

  buttons.forEach((btn, index) => {
    const def = BUBBLE_MENU_BUTTONS[index];
    btn.addEventListener('click', () => {
      def.command(editor);
    });
  });

  function updateActiveStates(): void {
    buttons.forEach((btn, index) => {
      const def = BUBBLE_MENU_BUTTONS[index];
      btn.classList.toggle('is-active', def.isActive(editor));
    });
  }

  editor.on('selectionUpdate', updateActiveStates);
  editor.on('update', updateActiveStates);
}
