import annotateAsPure from '@babel/helper-annotate-as-pure';
import type { Plugin } from './types.h';

interface InnerState {
  hasCreateToken: boolean;
}

export const createTokenPurePlugin: Plugin<InnerState> = ({ types: t }) => {
  return {
    pre() {
      this.hasCreateToken = false;
    },
    visitor: {
      ImportDeclaration(path) {
        if (this.hasCreateToken) {
          return;
        }

        const { node } = path;
        const sourceValue = node.source.value;

        if (sourceValue === '@tramvai/core' || sourceValue === '@tinkoff/dippy') {
          this.hasCreateToken = node.specifiers.some(
            (s) => s.type === 'ImportSpecifier' && s.local?.name === 'createToken'
          );
        }
      },
      CallExpression(path) {
        const { node } = path;

        if (!this.hasCreateToken) {
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
