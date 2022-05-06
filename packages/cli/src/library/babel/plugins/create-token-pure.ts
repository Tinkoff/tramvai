import annotateAsPure from '@babel/helper-annotate-as-pure';
import type { Plugin } from './types.h';

export const createTokenPurePlugin: Plugin = ({ types: t }) => {
  let hasCreateToken = false;

  return {
    visitor: {
      ImportDeclaration(path) {
        const { node } = path;
        const sourceValue = node.source.value;

        if (sourceValue === '@tramvai/core' || sourceValue === '@tinkoff/dippy') {
          hasCreateToken = node.specifiers.some(
            (s) => s.type === 'ImportSpecifier' && s.local?.name === 'createToken'
          );
        }
      },
      CallExpression(path) {
        const { node } = path;

        if (!hasCreateToken) {
          return;
        }

        const { callee } = node;

        if (callee?.type === 'Identifier') {
          if (callee?.name === 'createToken') {
            annotateAsPure(path);
          }
        }
      },
    },
  };
};

export default createTokenPurePlugin;
