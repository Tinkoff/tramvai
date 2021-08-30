/* eslint-disable no-param-reassign */
const { resolve } = require('path');
const visit = require('unist-util-visit');
const { readFile } = require('fs-extra');

const CWD_REGEXP = /\s*@doc-cwd\s+(\S+)/;
const IMPORT_REGEXP = /\s*@inline\s+(\S+)/;

const replaceNode = async (node, path) => {
  const content = await readFile(path, 'utf-8');

  node.type = 'code';
  node.lang = 'typescript';
  node.value = content;
};

module.exports = ({ cwd = '' } = {}) => {
  return async (tree) => {
    const promises = [];
    let currentCwd = cwd;

    visit(tree, 'comment', (node) => {
      const match = CWD_REGEXP.exec(node.value);

      if (match) {
        [, currentCwd] = match;
      }
    });

    visit(tree, 'text', (node) => {
      const match = IMPORT_REGEXP.exec(node.value);

      if (match) {
        promises.push(replaceNode(node, resolve(currentCwd, match[1])));
      }
    });

    await Promise.all(promises);

    return tree;
  };
};
/* eslint-enable no-param-reassign */
