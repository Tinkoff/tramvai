import type { Identifier, Expression, ObjectExpression } from '@babel/types';
import type { NodePath } from '@babel/traverse';
import type { Plugin } from './types.h';

const INNER_COMMENT = '__tramvai_stack_provider__';

export const providerStackPlugin: Plugin = ({ types: t }) => {
  const isProvider = (path: NodePath<ObjectExpression>) => {
    const { properties } = path.node;
    let hasProvideKey = false;
    let hasUseKey = false;

    for (const prop of properties) {
      if (t.isObjectProperty(prop)) {
        const { key } = prop;

        if (
          t.isIdentifier(key, { name: 'useValue' }) ||
          t.isIdentifier(key, { name: 'useFactory' }) ||
          t.isIdentifier(key, { name: 'useClass' })
        ) {
          hasUseKey = true;
        }

        if (t.isIdentifier(key, { name: 'provide' })) {
          hasProvideKey = true;
        }

        if (hasProvideKey && hasUseKey) {
          return true;
        }
      }
    }

    return false;
  };

  const generateStack = (path: NodePath<ObjectExpression>) => {
    if (path.scope.hasBinding('Error', true)) {
      path.scope.rename('Error');
    }

    return t.memberExpression(t.newExpression(t.identifier('Error'), []), t.identifier('stack'));
  };

  const defineProperty = (id: Identifier, value: Expression) => {
    return t.callExpression(
      t.memberExpression(t.identifier('Object'), t.identifier('defineProperty')),
      [
        id,
        t.stringLiteral('__stack'),
        t.objectExpression([
          t.objectProperty(t.identifier('enumerable'), t.booleanLiteral(false)),
          t.objectProperty(t.identifier('value'), value),
        ]),
      ]
    );
  };

  return {
    visitor: {
      ObjectExpression(path) {
        if (
          isProvider(path) &&
          !path.node.leadingComments?.find((comment) => comment.value === INNER_COMMENT)
        ) {
          const ref = path.scope.generateDeclaredUidIdentifier('ref');

          const newNode = t.addComment(
            t.objectExpression(path.node.properties),
            'leading',
            INNER_COMMENT
          );

          path.replaceWith(
            t.sequenceExpression([
              t.assignmentExpression('=', ref, newNode),
              defineProperty(ref, generateStack(path)),
              ref,
            ])
          );
        }
      },
    },
  };
};

export default providerStackPlugin;
