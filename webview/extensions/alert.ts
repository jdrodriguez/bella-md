import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

const ALERT_REGEX = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i;

export const GitHubAlerts = Extension.create({
  name: 'githubAlerts',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('githubAlerts'),
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];
            state.doc.descendants((node, pos) => {
              if (node.type.name !== 'blockquote') return true;
              // Check if the first text content starts with [!TYPE]
              const firstText = node.textContent;
              const match = firstText.match(ALERT_REGEX);
              if (!match) return true;
              const alertType = match[1].toLowerCase();
              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: `github-alert github-alert-${alertType}`,
                })
              );
              return false; // don't descend
            });
            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
