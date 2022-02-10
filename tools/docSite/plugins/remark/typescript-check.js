/**
 * Forked from https://github.com/trevorblades/remark-typescript
 */

const visit = require('unist-util-visit');
const { transformSync } = require('@babel/core');

function isReactComponent(node, tag) {
  return node && node.type === 'jsx' && node.value === tag;
}

const PRESERVE_COMMENT = '// preserve-line';
const PRESERVE_PATTERN = new RegExp(`\\s${PRESERVE_COMMENT}$`);

function remarkTypescript({ wrapperComponent } = {}) {
  return function transformer(tree, file) {
    function visitor(node, index, parent) {
      if (/^(?:tsx?|typescript)/.test(node.lang)) {
        const prevNode = parent.children[index - 1];
        const nextNode = parent.children[index + 1];

        if (wrapperComponent) {
          const isWrapped =
            isReactComponent(prevNode, `<${wrapperComponent}>`) &&
            isReactComponent(nextNode, `</${wrapperComponent}>`);
          if (!isWrapped) {
            return;
          }
        }

        const lines = node.value.split('\n');

        try {
          transformSync(
            lines.map((line) => (PRESERVE_PATTERN.test(line) ? `// ${line}` : line)).join('\n'),
            {
              filename: `file.tsx`,
              retainLines: true,
              presets: ['@babel/typescript'],
            }
          );
        } catch (error) {
          console.error(`Error in typescript-check-plugin, file ${file.history[0]}`, error.message);
          throw error;
        }
      }
    }

    visit(tree, 'code', visitor);
  };
}

module.exports = remarkTypescript;
