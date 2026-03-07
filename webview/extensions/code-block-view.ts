import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import type { EditorView } from '@tiptap/pm/view';

const LANGUAGES = [
  '', 'bash', 'c', 'cpp', 'csharp', 'css', 'diff', 'go', 'graphql',
  'ini', 'java', 'javascript', 'json', 'kotlin', 'less', 'lua',
  'makefile', 'markdown', 'objectivec', 'perl', 'php', 'plaintext',
  'python', 'r', 'ruby', 'rust', 'scss', 'shell', 'sql', 'swift',
  'typescript', 'xml', 'yaml',
];

export const CodeBlockLanguageSelector = Extension.create({
  name: 'codeBlockLanguageSelector',
  addProseMirrorPlugins() {
    const pluginKey = new PluginKey('codeBlockLanguageSelector');
    return [
      new Plugin({
        key: pluginKey,
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];
            state.doc.descendants((node, pos) => {
              if (node.type.name !== 'codeBlock') return false;
              const currentLang = (node.attrs.language as string) || '';
              const widget = Decoration.widget(pos + 1, (view: EditorView) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'code-block-lang-selector';
                wrapper.contentEditable = 'false';

                const select = document.createElement('select');
                for (const lang of LANGUAGES) {
                  const option = document.createElement('option');
                  option.value = lang;
                  option.textContent = lang || 'auto';
                  if (lang === currentLang) option.selected = true;
                  select.appendChild(option);
                }

                select.addEventListener('change', () => {
                  const tr = view.state.tr;
                  const nodeAtPos = view.state.doc.nodeAt(pos);
                  if (nodeAtPos && nodeAtPos.type.name === 'codeBlock') {
                    tr.setNodeMarkup(pos, undefined, {
                      ...nodeAtPos.attrs,
                      language: select.value,
                    });
                    view.dispatch(tr);
                  }
                });

                select.addEventListener('mousedown', (e) => e.stopPropagation());

                wrapper.appendChild(select);
                return wrapper;
              }, { side: -1 });
              decorations.push(widget);
              return false;
            });
            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
