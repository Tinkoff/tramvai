const path = require('path');
const fs = require('fs-extra');
const glob = require('fast-glob');

const root = path.resolve('..', '..');
const docsDest = 'tmp-docs';
const nestedDocsRegex = /\/docs\/((?:.+\/)?(?:[0-9a-zA-Z_-]+))\.md$/;

async function copyMdFiles() {
  await clearPreviousCopy();

  await copyDocs({ from: 'docs' });
  await copyDocs({ from: 'tinkoff-docs' });

  await safeCopy(path.join(root, 'CHANGELOG.md'), `${docsDest}/releases/changelog.md`);
  await safeCopy(path.join(root, 'migration.md'), `${docsDest}/releases/migration.md`);
  await safeCopy(path.join(root, 'CONTRIBUTING.md'), `${docsDest}/contribute/contribute.md`);

  await copyDocs({ from: 'packages/tramvai', to: `${docsDest}/references/tramvai` });
  await copyDocs({ from: 'packages/cli', to: `${docsDest}/references/cli` });
  await copyDocs({ from: 'packages/modules', to: `${docsDest}/references/modules` });
  await copyDocs({ from: 'packages/tokens', to: `${docsDest}/references/tokens` });
  await copyDocs({ from: 'packages/libs', to: `${docsDest}/references/libs` });
  await copyDocs({ from: 'tools', to: `${docsDest}/references/tools` });

  await copyDocs({ from: 'tinkoff-packages/tramvai', to: `${docsDest}/references/tramvai` });
  await copyDocs({ from: 'tinkoff-packages/cli', to: `${docsDest}/references/cli` });
  await copyDocs({
    from: 'tinkoff-packages/modules',
    to: `${docsDest}/references/tinkoff-modules`,
  });
  await copyDocs({ from: 'tinkoff-packages/tokens', to: `${docsDest}/references/tinkoff-tokens` });
  await copyDocs({ from: 'tinkoff-packages/libs', to: `${docsDest}/references/tinkoff-libs` });
  await copyDocs({ from: 'tinkoff-tools', to: `${docsDest}/references/tinkoff-tools` });

  await copyDocs({
    from: 'examples/how-to',
    to: `${docsDest}/how-to`,
    ignore: ['examples/how-to/README.md'],
  });
  await copyDocs({
    from: 'tinkoff-examples/how-to',
    to: `${docsDest}/how-to`,
    ignore: ['tinkoff-examples/how-to/README.md'],
  });
}

async function copyDocs({ from, to = docsDest, ignore = [] }) {
  const docs = await glob([`${from}/**/*.md`, `${from}/**/_category_.json`], {
    cwd: root,
    ignore: [
      '**/lib/**',
      '**/dist/**',
      '**/__fixtures__/**',
      '**/__integrations/**',
      '**/node_modules/**',
      'tools/docSite/**',
      'router-way/**',
      '**/deprecated-*/**',
      ...ignore,
    ],
  });

  await Promise.all(
    docs.map((file) => {
      const fileExt = path.extname(file);
      const isMdFile = fileExt === '.md' || fileExt === '.mdx';
      const fileFrom = path.join(root, file);
      const fileTo = path.join(process.cwd(), file.replace(from, to));

      return isMdFile
        ? copyDocFile({
            from: fileFrom,
            to: fileTo,
          })
        : safeCopy(fileFrom, fileTo);
    })
  );
}

async function copyDocFile({ from, to }) {
  try {
    let fileContent = (await fs.readFile(from, 'utf-8')).split('\n');
    const fileCwd = path.dirname(from);
    const hasMetadata = fileContent[0] === '---';
    let removedMetadata;

    // комментарии до front matter ломают парсинг документа,
    // поэтому добавляем комментарий после front matter
    if (hasMetadata) {
      const metadataClosedIndex = fileContent.findIndex(
        (item, index) => index !== 0 && item === '---'
      );
      removedMetadata = fileContent.splice(0, metadataClosedIndex + 1);
    }

    // добавляем указание на текущую директорию с файлом
    fileContent.unshift(`<!--@doc-cwd ${path.dirname(from)}-->`);

    // возвращаем удаленный front matter
    if (removedMetadata) {
      fileContent = [...removedMetadata, ...fileContent];
    }

    // удаляем h1 заголовок, его проставляет Docusaurus
    const headerIndex = fileContent.findIndex((item) => item.startsWith('# '));

    if (headerIndex) {
      fileContent.splice(headerIndex, 1);
    }

    //
    // считаем, что если в папке с файлом есть `_category_.json`,
    // значит нужно сохранить путь до папки с файлов, и переименовать текущий README.md в base.md,
    // например файл `packages/libs/foo/README.md` будет скопирован в `tmp-docs/references/libs/foo/base.md`
    //
    // если в папке с файлом нет `_category_.json`, переименовываем README.md в название текушей папки,
    // например файл `packages/libs/foo/README.md` будет скопирован в `tmp-docs/references/libs/foo.md`
    //

    const hasCategoryJson = isCategoryDir({ directory: fileCwd });
    let outputFilename = to;

    if (hasCategoryJson) {
      // @todo заменить 'base.md' на 'index.md' после релиза https://github.com/facebook/docusaurus/pull/6495/files ?
      outputFilename = to.replace(/(README|readme)\.md$/, 'base.md');
    } else {
      outputFilename = to.replace(/\/(README|readme)\.md$/, '.md');
    }

    //
    // считаем, что если файл находится в подпапке `docs`,
    // то при копировании нужно поднять файл на уровень выше,
    // например `packages/libs/foo/docs/test.md` будет скопирован в `tmp-docs/references/libs/foo/test.md`
    //

    const nestedCategoryDocsMatch = nestedDocsRegex.exec(from);

    if (nestedCategoryDocsMatch) {
      outputFilename = outputFilename.replace(nestedDocsRegex, '/$1.md');
    }

    await fs.outputFile(outputFilename, fileContent.join('\n'), 'utf-8');
  } catch (e) {
    console.warn(`Copy doc file failed: from ${from} to ${to}, error`, e);
  }
}

async function clearPreviousCopy() {
  return fs.remove(path.resolve(docsDest));
}

function isCategoryDir({ directory }) {
  let categoryJson;
  try {
    categoryJson = require(path.join(directory, '_category_.json'));
  } catch (e) {
    // do nothing
  }
  return !!categoryJson;
}

copyMdFiles();

async function safeCopy(from, to) {
  try {
    await fs.copy(from, to);
  } catch (e) {
    console.warn(`Copy failed: from ${from} to ${to}, error`, e);
  }
}
