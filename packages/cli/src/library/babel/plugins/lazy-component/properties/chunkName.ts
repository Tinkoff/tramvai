import { NodePath } from '@babel/core';
import {
  BinaryExpression,
  CallExpression,
  Expression,
  StringLiteral,
  TemplateElement,
  TemplateLiteral,
} from '@babel/types';
import { ImportPath, PropertyFactory } from './types';
import {
  generateWebpackComments,
  parseWebpackComments,
  WebpackComments,
} from '../../utils/webpackComments';

const JS_PATH_REGEXP = /^[./]+|(\.js$)/g;
const MATCH_LEFT_HYPHENS_REPLACE_REGEX = /^-/g;
const WEBPACK_CHUNK_NAME_REGEXP = /webpackChunkName/;
const WEBPACK_PATH_NAME_NORMALIZE_REPLACE_REGEX = /[^a-zA-Z0-9_!§$()=\-^°]+/g;
const WEBPACK_MATCH_PADDED_HYPHENS_REPLACE_REGEX = /^-|-$/g;

const getChunkNameComment = (importArg: NodePath) => {
  const comments = importArg.node.leadingComments;

  if (!comments) return null;

  return comments.find((comment) => comment.value.match(WEBPACK_CHUNK_NAME_REGEXP));
};

const getRawChunkNameFromComments = (importArg: NodePath) => {
  const chunkNameComment = getChunkNameComment(importArg);

  if (!chunkNameComment) return null;

  return parseWebpackComments(chunkNameComment.value);
};

const moduleToChunk = (str?: string) => {
  if (typeof str !== 'string') return '';

  return str
    .replace(JS_PATH_REGEXP, '')
    .replace(WEBPACK_PATH_NAME_NORMALIZE_REPLACE_REGEX, '-')
    .replace(WEBPACK_MATCH_PADDED_HYPHENS_REPLACE_REGEX, '');
};

const replaceQuasi = (str: string, stripLeftHyphen: boolean) => {
  if (!str) return '';
  const result = str.replace(WEBPACK_PATH_NAME_NORMALIZE_REPLACE_REGEX, '-');
  if (!stripLeftHyphen) return result;
  return result.replace(MATCH_LEFT_HYPHENS_REPLACE_REGEX, '');
};

const getChunkNamePrefix = (chunkName?: string) => {
  if (typeof chunkName !== 'string') return '';
  const match = chunkName.match(/(.+?)\[(request|index)\]$/);
  return match ? match[1] : '';
};

const getImportArg = (importPath: ImportPath) => {
  const arg = importPath.get('arguments')[0];

  if (arg.isStringLiteral() || arg.isTemplateLiteral()) {
    return arg;
  }
};

// высчитывает имя чанка, учитывая разные кейсы нейминга и использование динамических испортов на основании пропсов
// также добавляет комментарий для webpack чтобы это имя чанка использовалось для файла
export const chunkNameMethod: PropertyFactory = ({ types: t }) => {
  const transformQuasi = (quasi: TemplateElement, first: boolean, single: boolean) => {
    return t.templateElement(
      {
        raw: single ? moduleToChunk(quasi.value.raw) : replaceQuasi(quasi.value.raw, first),
        cooked: single
          ? moduleToChunk(quasi.value.cooked)
          : replaceQuasi(quasi.value.cooked, first),
      },
      quasi.tail
    );
  };

  const sanitizeChunkNameTemplateLiteral = (node: Expression) => {
    return t.callExpression(t.memberExpression(node, t.identifier('replace')), [
      t.regExpLiteral(WEBPACK_PATH_NAME_NORMALIZE_REPLACE_REGEX.source, 'g'),
      t.stringLiteral('-'),
    ]);
  };

  const combineExpressions = (node: TemplateLiteral) => {
    const expressions = node.expressions as Expression[];
    const { length } = expressions;

    if (length === 1) {
      return expressions[0];
    }

    return expressions.slice(1).reduce((r, p) => t.binaryExpression('+', r, p), expressions[0]);
  };

  const generateChunkNameNode = (importPath: ImportPath, prefix?: string) => {
    const importArg = getImportArg(importPath);
    if (importArg.isTemplateLiteral()) {
      return prefix
        ? t.binaryExpression(
            '+',
            t.stringLiteral(prefix),
            sanitizeChunkNameTemplateLiteral(combineExpressions(importArg.node))
          )
        : t.templateLiteral(
            importArg.node.quasis.map((quasi, index) =>
              transformQuasi(quasi, index === 0, importArg.node.quasis.length === 1)
            ),
            importArg.node.expressions
          );
    }
    return t.stringLiteral(moduleToChunk(importArg.node.value));
  };

  const getExistingChunkNameComment = (importPath: ImportPath) => {
    const importArg = getImportArg(importPath);
    const values = getRawChunkNameFromComments(importArg);

    return values;
  };

  const isAggressiveImport = (importPath: ImportPath) => {
    const importArg = getImportArg(importPath);

    return importArg.isTemplateLiteral() && importArg.node.expressions.length > 0;
  };

  const addOrReplaceChunkNameComment = (importPath: ImportPath, values: WebpackComments) => {
    const importArg = getImportArg(importPath);
    const chunkNameComment = getChunkNameComment(importArg);

    if (chunkNameComment) {
      t.removeComments(importArg.node);
    }

    importArg.addComment('leading', generateWebpackComments(values));
  };

  const chunkNameFromTemplateLiteral = (node: TemplateLiteral) => {
    const [q1] = node.quasis;
    const v1 = q1 ? q1.value.cooked : '';

    if (!node.expressions.length) return v1;

    return `${v1}[request]`;
  };

  const replaceChunkName = (importPath: ImportPath) => {
    const aggressiveImport = isAggressiveImport(importPath);
    const values = getExistingChunkNameComment(importPath);
    let { webpackChunkName } = values || {};

    if (!aggressiveImport && values) {
      addOrReplaceChunkNameComment(importPath, values);
      return t.stringLiteral(webpackChunkName);
    }

    let chunkNameNode:
      | CallExpression
      | TemplateLiteral
      | StringLiteral
      | BinaryExpression = generateChunkNameNode(importPath, getChunkNamePrefix(webpackChunkName));

    if (t.isTemplateLiteral(chunkNameNode)) {
      webpackChunkName = chunkNameFromTemplateLiteral(chunkNameNode);
      chunkNameNode = sanitizeChunkNameTemplateLiteral(chunkNameNode);
    } else if (t.isStringLiteral(chunkNameNode)) {
      webpackChunkName = chunkNameNode.value;
    }

    addOrReplaceChunkNameComment(importPath, { ...values, webpackChunkName });
    return chunkNameNode;
  };

  return ({ funcPath, importPath }) => {
    const chunkName = replaceChunkName(importPath);

    return t.objectMethod(
      'method',
      t.identifier('chunkName'),
      funcPath.node.params,
      t.blockStatement([t.returnStatement(chunkName)])
    );
  };
};
