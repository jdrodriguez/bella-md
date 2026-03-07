import { Editor, Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

const searchPluginKey = new PluginKey('search');

interface SearchState {
  query: string;
  caseSensitive: boolean;
  matches: { from: number; to: number }[];
  currentIndex: number;
}

function emptyState(): SearchState {
  return { query: '', caseSensitive: false, matches: [], currentIndex: -1 };
}

function findMatches(doc: any, query: string, caseSensitive: boolean): { from: number; to: number }[] {
  if (!query) return [];
  const matches: { from: number; to: number }[] = [];
  const flags = caseSensitive ? 'g' : 'gi';
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, flags);

  doc.descendants((node: any, pos: number) => {
    if (!node.isText) return;
    const text = node.text!;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      matches.push({ from: pos + m.index, to: pos + m.index + m[0].length });
    }
  });
  return matches;
}

function buildDecorations(doc: any, state: SearchState): DecorationSet {
  if (!state.matches.length) return DecorationSet.empty;
  const decorations = state.matches.map((m, i) => {
    const cls = i === state.currentIndex ? 'search-match search-match-current' : 'search-match';
    return Decoration.inline(m.from, m.to, { class: cls });
  });
  return DecorationSet.create(doc, decorations);
}

export function createSearchExtension(): ReturnType<typeof Extension.create> {
  return Extension.create({
    name: 'search',
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: searchPluginKey,
          state: {
            init() {
              return { state: emptyState(), decorations: DecorationSet.empty };
            },
            apply(tr, value) {
              const meta = tr.getMeta(searchPluginKey);
              if (meta) {
                const s = meta as SearchState;
                return { state: s, decorations: buildDecorations(tr.doc, s) };
              }
              // Map decorations through document changes
              if (tr.docChanged) {
                return { state: value.state, decorations: value.decorations.map(tr.mapping, tr.doc) };
              }
              return value;
            },
          },
          props: {
            decorations(state) {
              return this.getState(state)?.decorations ?? DecorationSet.empty;
            },
          },
        }),
      ];
    },
  });
}

function dispatchSearch(editor: Editor, query: string, caseSensitive: boolean, currentIndex: number): SearchState {
  const matches = findMatches(editor.state.doc, query, caseSensitive);
  let idx = currentIndex;
  if (matches.length === 0) {
    idx = -1;
  } else {
    if (idx < 0) idx = 0;
    if (idx >= matches.length) idx = matches.length - 1;
  }
  const searchState: SearchState = { query, caseSensitive, matches, currentIndex: idx };
  editor.view.dispatch(editor.state.tr.setMeta(searchPluginKey, searchState));
  return searchState;
}

function scrollToMatch(editor: Editor, match: { from: number; to: number }): void {
  const dom = editor.view.domAtPos(match.from);
  if (dom.node instanceof HTMLElement) {
    dom.node.scrollIntoView({ block: 'center', behavior: 'smooth' });
  } else if (dom.node.parentElement) {
    dom.node.parentElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}

export function createSearchBar(editor: Editor): HTMLElement {
  const bar = document.createElement('div');
  bar.className = 'search-bar';

  // --- Find row ---
  const findRow = document.createElement('div');
  findRow.className = 'search-bar-row';

  const findInput = document.createElement('input');
  findInput.type = 'text';
  findInput.placeholder = 'Find';
  findInput.setAttribute('aria-label', 'Find');

  const matchCount = document.createElement('span');
  matchCount.className = 'match-count';

  const caseBtn = document.createElement('button');
  caseBtn.textContent = 'Aa';
  caseBtn.title = 'Match case';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '\u2191';
  prevBtn.title = 'Previous match';

  const nextBtn = document.createElement('button');
  nextBtn.textContent = '\u2193';
  nextBtn.title = 'Next match';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '\u00d7';
  closeBtn.title = 'Close (Escape)';

  findRow.append(findInput, matchCount, caseBtn, prevBtn, nextBtn, closeBtn);

  // --- Replace row ---
  const replaceRow = document.createElement('div');
  replaceRow.className = 'search-bar-row';

  const replaceInput = document.createElement('input');
  replaceInput.type = 'text';
  replaceInput.placeholder = 'Replace';
  replaceInput.setAttribute('aria-label', 'Replace');

  const replaceBtn = document.createElement('button');
  replaceBtn.textContent = 'Replace';
  replaceBtn.title = 'Replace current match';

  const replaceAllBtn = document.createElement('button');
  replaceAllBtn.textContent = 'All';
  replaceAllBtn.title = 'Replace all matches';

  replaceRow.append(replaceInput, replaceBtn, replaceAllBtn);

  bar.append(findRow, replaceRow);

  // --- State ---
  let caseSensitive = false;
  let currentState = emptyState();

  function updateMatchCount(): void {
    const total = currentState.matches.length;
    if (!currentState.query) {
      matchCount.textContent = '';
    } else if (total === 0) {
      matchCount.textContent = 'No results';
    } else {
      matchCount.textContent = `${currentState.currentIndex + 1} of ${total}`;
    }
  }

  function runSearch(moveTo?: number): void {
    const idx = moveTo !== undefined ? moveTo : (currentState.matches.length > 0 ? currentState.currentIndex : 0);
    currentState = dispatchSearch(editor, findInput.value, caseSensitive, idx);
    updateMatchCount();
    if (currentState.currentIndex >= 0 && currentState.matches[currentState.currentIndex]) {
      scrollToMatch(editor, currentState.matches[currentState.currentIndex]);
    }
  }

  function clearSearch(): void {
    currentState = emptyState();
    editor.view.dispatch(editor.state.tr.setMeta(searchPluginKey, currentState));
    matchCount.textContent = '';
  }

  function close(): void {
    bar.classList.remove('is-open');
    clearSearch();
    editor.commands.focus();
  }

  // --- Events ---
  findInput.addEventListener('input', () => runSearch(0));

  caseBtn.addEventListener('click', () => {
    caseSensitive = !caseSensitive;
    caseBtn.classList.toggle('is-active', caseSensitive);
    runSearch(0);
  });

  prevBtn.addEventListener('click', () => {
    if (currentState.matches.length === 0) return;
    const idx = currentState.currentIndex <= 0 ? currentState.matches.length - 1 : currentState.currentIndex - 1;
    runSearch(idx);
  });

  nextBtn.addEventListener('click', () => {
    if (currentState.matches.length === 0) return;
    const idx = currentState.currentIndex >= currentState.matches.length - 1 ? 0 : currentState.currentIndex + 1;
    runSearch(idx);
  });

  closeBtn.addEventListener('click', close);

  replaceBtn.addEventListener('click', () => {
    if (currentState.currentIndex < 0 || !currentState.matches.length) return;
    const match = currentState.matches[currentState.currentIndex];
    editor.chain()
      .focus()
      .command(({ tr }) => {
        tr.replaceWith(match.from, match.to, editor.state.schema.text(replaceInput.value));
        return true;
      })
      .run();
    // Re-run search; keep index clamped
    runSearch(currentState.currentIndex);
  });

  replaceAllBtn.addEventListener('click', () => {
    if (!currentState.matches.length) return;
    const replacement = replaceInput.value;
    // Replace in reverse order to preserve positions
    editor.chain()
      .focus()
      .command(({ tr }) => {
        for (let i = currentState.matches.length - 1; i >= 0; i--) {
          const m = currentState.matches[i];
          tr.replaceWith(m.from, m.to, editor.state.schema.text(replacement));
        }
        return true;
      })
      .run();
    runSearch(0);
  });

  // Escape closes the bar; Enter goes to next match
  bar.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
    if (e.key === 'Enter' && document.activeElement === findInput) {
      e.preventDefault();
      if (e.shiftKey) {
        prevBtn.click();
      } else {
        nextBtn.click();
      }
    }
  });

  return bar;
}

export function setupSearchKeybinding(editor: Editor, searchBar: HTMLElement): void {
  const findInput = searchBar.querySelector('input') as HTMLInputElement;

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = searchBar.classList.contains('is-open');
      if (isOpen) {
        findInput.focus();
        findInput.select();
      } else {
        searchBar.classList.add('is-open');
        findInput.value = '';
        findInput.focus();
      }
    }
  });
}
