const { dirname } = require('path');
const dirTree = require('directory-tree');
const readDocFile = require('./readDocFile');

module.exports = async (content, path) => {
  const result = [''];
  const promises = [];

  const root = dirname(path);

  dirTree(root, {}, (example) => {
    if (example.path === path) {
      return;
    }

    promises.push(
      (async () => {
        const file = await readDocFile(example.path);

        result.push(
          '<p>',
          '<details>',
          `    <summary>${example.path.replace(root, '')}</summary>`,
          '',
          '```tsx',
          file,
          '```',
          '</details>',
          '</p>',
          ''
        );
      })()
    );
  });

  await Promise.all(promises);

  result.push(`#### ${path.replace(root, '')}`, '```tsx', content, '```');

  return result;
};
