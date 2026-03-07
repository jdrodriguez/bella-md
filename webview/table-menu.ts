import { Editor } from '@tiptap/core';

/* ------------------------------------------------------------------ */
/*  Inline table controls (+ buttons to add rows / columns)           */
/* ------------------------------------------------------------------ */

function attachTableControls(editor: Editor): void {
  const proseMirror = editor.view.dom as HTMLElement;

  // Clean up old controls
  proseMirror.querySelectorAll('.table-add-row, .table-add-col').forEach(el => el.remove());

  const wrappers = proseMirror.querySelectorAll('.tableWrapper');
  wrappers.forEach((wrapper) => {
    const table = wrapper.querySelector('table');
    if (!table) return;

    // "+ Row" button at the bottom center
    const addRowBtn = document.createElement('button');
    addRowBtn.className = 'table-add-row';
    addRowBtn.textContent = '+';
    addRowBtn.title = 'Add row';
    addRowBtn.contentEditable = 'false';
    addRowBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const lastCell = table.querySelector('tr:last-child td:first-child, tr:last-child th:first-child');
      if (lastCell) {
        const pos = editor.view.posAtDOM(lastCell, 0);
        editor.chain().focus(pos).addRowAfter().run();
      }
    });
    wrapper.appendChild(addRowBtn);

    // "+ Column" button at the right side
    const addColBtn = document.createElement('button');
    addColBtn.className = 'table-add-col';
    addColBtn.textContent = '+';
    addColBtn.title = 'Add column';
    addColBtn.contentEditable = 'false';
    addColBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const lastHeaderCell = table.querySelector('tr:first-child th:last-child, tr:first-child td:last-child');
      if (lastHeaderCell) {
        const pos = editor.view.posAtDOM(lastHeaderCell, 0);
        editor.chain().focus(pos).addColumnAfter().run();
      }
    });
    wrapper.appendChild(addColBtn);
  });
}

export function setupTableControls(editor: Editor): void {
  // Attach controls after every update and on initial render
  editor.on('update', () => requestAnimationFrame(() => attachTableControls(editor)));
  editor.on('create', () => requestAnimationFrame(() => attachTableControls(editor)));
  // Also re-attach after content is set (e.g. init message)
  setTimeout(() => attachTableControls(editor), 300);
}

/* ------------------------------------------------------------------ */
/*  Table context menu (right-click)                                   */
/* ------------------------------------------------------------------ */

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
