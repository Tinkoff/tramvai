import type { Rule } from 'eslint';
import { runInNewContext } from 'vm';
import isString from '@tinkoff/utils/is/string';
import last from '@tinkoff/utils/array/last';
import reduceObj from '@tinkoff/utils/object/reduce';

interface Config {
  propertyNames?: string[];
}

const convertObjToString = (obj: Record<string, any>) => {
  return reduceObj(
    (acc, v, k) => {
      acc.push(`${k}: ${isString(v) ? `"${v}"` : v}`);

      return acc;
    },
    [] as string[],
    obj
  ).join(', ');
};

const paddedCommentRegex = /^ (\S[\s\S]+\S) $/;

export const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Проверяет что имя чанка сгенерированного вебпаком будет соответствовать имени бандла',
      category: 'tramvai',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          propertyNames: {
            type: 'array',
            uniqueItems: true,
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const config: Config = context.options[0] ?? {};
    const propertyNames = config.propertyNames ?? ['bundles'];

    const checkImport = (node: any, nodeSource: any) => {
      const prop = node.parent?.parent;

      if (!prop) {
        return;
      }

      const parentProp = prop.parent?.parent;

      if (parentProp?.type !== 'Property' || !propertyNames.includes(parentProp.key.name)) {
        return;
      }

      const propName = prop.key.value || prop.key.name;
      const chunkName = last(propName.split('/'));
      const sourceCode = context.getSourceCode();
      const comments = sourceCode.getCommentsBefore(nodeSource);

      if (!comments || comments.length === 0) {
        return context.report({
          node,
          message:
            'dynamic imports for bundles require a leading comment with option webpackChunkName',
          fix: (fixer) => {
            return fixer.insertTextBefore(nodeSource, `/* webpackChunkName: "${chunkName}" */ `);
          },
        });
      }

      for (const comment of comments) {
        if (comment.type !== 'Block') {
          return context.report({
            node,
            message: 'dynamic imports for bundles require a /* */ style comment, not a // comment',
            fix: (fixer) => {
              return fixer.replaceText(comment as any, `/* ${comment.value.trim()} */`);
            },
          });
        }

        if (!paddedCommentRegex.test(comment.value)) {
          return context.report({
            node,
            message: `dynamic imports require a block comment padded with spaces - /* ... */`,
            fix: (fixer) => {
              return fixer.replaceText(comment as any, `/* ${comment.value.trim()} */`);
            },
          });
        }

        let evaledComment: Record<string, any> | undefined;
        try {
          // just like webpack itself does
          evaledComment = runInNewContext(`(function(){return {${comment.value}}})()`);
        } catch (e) {}

        if (!evaledComment) {
          return context.report({
            node,
            message: `dynamic imports require a "webpack" comment with valid syntax`,
          });
        }

        if (evaledComment.webpackChunkName !== chunkName) {
          return context.report({
            node,
            message: `dynamic imports for bundles require a leading comment with option webpackChunkName: "${chunkName}"`,
            fix: (fixer) => {
              return fixer.replaceText(
                comment as any,
                `/* ${convertObjToString({ ...evaledComment, webpackChunkName: chunkName })} */`
              );
            },
          });
        }
      }
    };

    return {
      ImportExpression(node) {
        return checkImport(node, node.source);
      },
      CallExpression(node) {
        // @ts-ignore
        if (node?.callee?.type === 'Import') {
          return checkImport(node, node.arguments[0]);
        }
      },
    };
  },
};
