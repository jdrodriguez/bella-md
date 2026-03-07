import { Editor } from '@tiptap/core';

export function setupTableContextMenu(editor: Editor): void {
  const menu = document.createElement('div');
  menu.className = 'table-context-menu';
  document.body.appendChild(menu);

  const actions = [
    { label: 'Insert Row Above', action: () => editor.chain().focus().addRowBefore().run() },
    { label: 'Insert Row Below', action: () => editor.chain().focus().addRowAfter().run() },
    { label: '---', action: null },
    { label: 'Insert Column Left', action: () => editor.chain().focus().addColumnBefore().run() },
    { label: 'Insert Column Right', action: () => editor.chain().focus().addColumnAfter().run() },
    { label: '---', action: null },
    { label: 'Delete Row', action: () => editor.chain().focus().deleteRow().run() },
    { label: 'Delete Column', action: () => editor.chain().focus().deleteColumn().run() },
    { label: '---', action: null },
    { label: 'Delete Table', action: () => editor.chain().focus().deleteTable().run() },
  ];

  function hideMenu() {
    menu.classList.remove('is-open');
  }

  function showMenu(x: number, y: number) {
    menu.innerHTML = '';
    for (const item of actions) {
      if (item.label === '---') {
        const sep = document.createElement('div');
        sep.className = 'table-context-menu-separator';
        menu.appendChild(sep);
        continue;
      }
      const btn = document.createElement('button');
      btn.className = 'table-context-menu-item';
      btn.textContent = item.label;
      btn.addEventListener('click', () => {
        item.action!();
        hideMenu();
      });
      menu.appendChild(btn);
    }
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.classList.add('is-open');
  }

  editor.view.dom.addEventListener('contextmenu', (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const cell = target.closest('td, th');
    if (!cell) return;

    event.preventDefault();
    showMenu(event.clientX, event.clientY);
  });

  document.addEventListener('click', (event: MouseEvent) => {
    if (!menu.contains(event.target as Node)) {
      hideMenu();
    }
  });

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      hideMenu();
    }
  });
}
