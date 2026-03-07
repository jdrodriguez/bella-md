import { Editor } from '@tiptap/core';

const COLOR_PALETTE = [
  '#1e1e1e', '#e03131', '#e8590c', '#f08c00', '#2f9e44', '#1971c2',
  '#6741d9', '#c2255c', '#868e96', '#fa5252', '#fd7e14', '#fab005',
  '#51cf66', '#339af0', '#845ef7', '#f06595', '#ffffff', '#f8f9fa',
];

export function createColorPicker(editor: Editor): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'color-picker-wrapper';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'color-picker-trigger';
  trigger.title = 'Text Color';
  trigger.setAttribute('aria-label', 'Text Color');

  const label = document.createElement('span');
  label.className = 'color-label';
  label.textContent = 'A';

  const underline = document.createElement('span');
  underline.className = 'color-underline';
  underline.style.backgroundColor = '#1e1e1e';

  trigger.appendChild(label);
  trigger.appendChild(underline);

  const panel = document.createElement('div');
  panel.className = 'color-picker-panel';

  const grid = document.createElement('div');
  grid.className = 'color-picker-grid';

  let activeColorBtn: HTMLButtonElement | null = null;

  for (const color of COLOR_PALETTE) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = color;
    btn.setAttribute('aria-label', `Set text color ${color}`);
    btn.style.backgroundColor = color;

    if (color === '#ffffff' || color === '#f8f9fa') {
      btn.style.borderColor = 'var(--vscode-panel-border, #e0e0e0)';
    }

    btn.addEventListener('mousedown', (ev) => ev.preventDefault());
    btn.addEventListener('click', () => {
      if (color === '#1e1e1e') {
        editor.chain().focus().unsetColor().run();
      } else {
        editor.chain().focus().setColor(color).run();
      }

      if (activeColorBtn) {
        activeColorBtn.classList.remove('is-active');
      }
      btn.classList.add('is-active');
      activeColorBtn = btn;
      underline.style.backgroundColor = color;
      panel.classList.remove('is-open');
    });

    grid.appendChild(btn);
  }

  panel.appendChild(grid);

  trigger.addEventListener('mousedown', (ev) => ev.preventDefault());
  trigger.addEventListener('click', () => {
    panel.classList.toggle('is-open');
  });

  document.addEventListener('click', (ev) => {
    if (!wrapper.contains(ev.target as Node)) {
      panel.classList.remove('is-open');
    }
  });

  wrapper.appendChild(trigger);
  wrapper.appendChild(panel);
  return wrapper;
}
