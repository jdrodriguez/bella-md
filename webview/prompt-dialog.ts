export function requestPrompt(title: string, defaultValue?: string): Promise<string | null> {
  return new Promise((resolve) => {
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'prompt-overlay';

    // Dialog
    const dialog = document.createElement('div');
    dialog.className = 'prompt-dialog';

    const label = document.createElement('label');
    label.className = 'prompt-label';
    label.textContent = title;

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'prompt-input';
    input.value = defaultValue ?? '';

    const buttonRow = document.createElement('div');
    buttonRow.className = 'prompt-buttons';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'prompt-btn prompt-btn-cancel';
    cancelBtn.textContent = 'Cancel';

    const okBtn = document.createElement('button');
    okBtn.type = 'button';
    okBtn.className = 'prompt-btn prompt-btn-ok';
    okBtn.textContent = 'OK';

    buttonRow.appendChild(cancelBtn);
    buttonRow.appendChild(okBtn);

    dialog.appendChild(label);
    dialog.appendChild(input);
    dialog.appendChild(buttonRow);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    function cleanup(value: string | null): void {
      overlay.remove();
      resolve(value);
    }

    cancelBtn.addEventListener('click', () => cleanup(null));
    okBtn.addEventListener('click', () => cleanup(input.value));

    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') { cleanup(input.value); }
      if (ev.key === 'Escape') { cleanup(null); }
    });

    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) { cleanup(null); }
    });

    // Focus the input after a tick so it's ready
    requestAnimationFrame(() => {
      input.focus();
      input.select();
    });
  });
}
