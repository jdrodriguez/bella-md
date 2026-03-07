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
    const storage = editor.storage.characterCount as {
      characters: () => number;
      words: () => number;
    };
    const words = storage.words();
    const chars = storage.characters();
    wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    charCount.textContent = `${chars} character${chars !== 1 ? 's' : ''}`;
  }

  updateCounts();
  editor.on('update', updateCounts);

  return bar;
}
