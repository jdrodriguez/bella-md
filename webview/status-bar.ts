import { Editor } from '@tiptap/core';

/* ------------------------------------------------------------------ */
/*  Status bar (character/word count)                                  */
/* ------------------------------------------------------------------ */

export function createStatusBar(editor: Editor): HTMLElement {
  const bar = document.createElement('div');
  bar.className = 'status-bar';

  const wordCount = document.createElement('span');
  wordCount.textContent = '0 words';

  const charCount = document.createElement('span');
  charCount.textContent = '0 characters';

  bar.appendChild(wordCount);
  bar.appendChild(charCount);

  function updateCounts(): void {
    try {
      const storage = editor.storage.characterCount;
      if (!storage) {
        wordCount.textContent = '–';
        charCount.textContent = '–';
        return;
      }
      const words = typeof storage.words === 'function' ? storage.words() : 0;
      const chars = typeof storage.characters === 'function' ? storage.characters() : 0;
      const docText = editor.state.doc.textContent;
      console.log('[BellaMD] counts:', { words, chars, docTextLen: docText.length, storageKeys: Object.keys(storage) });
      wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
      charCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
    } catch (e) {
      console.error('[BellaMD] status bar error:', e);
    }
  }

  updateCounts();
  editor.on('update', updateCounts);
  editor.on('selectionUpdate', updateCounts);
  // Also update after a short delay to catch initial content load
  setTimeout(updateCounts, 500);

  return bar;
}
