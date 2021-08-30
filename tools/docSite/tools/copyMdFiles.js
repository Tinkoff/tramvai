const uniq = require('@tinkoff/utils/array/uniq');
const toArray = require('@tinkoff/utils/array/toArray');
const mapObj = require('@tinkoff/utils/object/map');
const reduceObj = require('@tinkoff/utils/object/reduce');
const fs = require('fs-extra');
const { resolve, dirname } = require('path');
const dirTree = require('directory-tree');
const generateExample = require('./generateExample');
const readDocFile = require('./readDocFile');
const isRemotePath = require('./isRemotePath');

const root = resolve('..', '..');
const tempDocsPath = resolve('tmp-docs');

const makeHeaders = (doc) => {
  return reduceObj(
    (acc, v, k) => {
      acc.push(`${k}: ${v}`);
      return acc;
    },
    [],
    doc
  ).join(' \n');
};

const copyFile = async (path, name, doc) => {
  const newPath = resolve(tempDocsPath, `${name}.md`);

  const file = await readDocFile(path);

  const modifyFile = doc.example ? await generateExample(file, path) : file.split('\n');

  if (modifyFile[0] !== '---') {
    // удаляем первую строку, так как там будет заголовок
    modifyFile.shift();
    // добавляем указание на текущую директорию с файлом
    modifyFile.unshift(`<!--@doc-cwd ${dirname(path)}-->`);
    // Добавляем заголовок который необходим для докариуса
    modifyFile.unshift(`---\n${makeHeaders(doc)} \n---`);
  }

  // Записываем в файл
  await fs.outputFile(resolve(root, newPath), modifyFile.join('\n'), 'utf-8');

  console.info('Дока:', name, 'По пути:', path, 'Перенесена в:', newPath);
};

const priorities = {};

const sortDocs = (doc) => {
  if (!Array.isArray(doc)) {
    return;
  }

  const docCopy = [...doc];

  doc.sort((a, b) => {
    if (typeof a !== 'string') {
      sortDocs(a.items);
      return 0;
    }
    if (typeof b !== 'string') {
      sortDocs(b.items);
      return 0;
    }

    const aPrioriry = priorities[b];
    const bPriority = priorities[a];

    if (aPrioriry > bPriority) {
      return 1;
    }
    if (aPrioriry < bPriority) {
      return -1;
    }
    return docCopy.indexOf(a) - docCopy.indexOf(b);
  });
};

async function copyRootDocs() {
  return fs.copy(resolve(root, 'docs'), tempDocsPath);
}

// Здесь потенциальный баг, нужно сделать ассинхронным
async function collectAllProjectDocs() {
  const docsResult = Object.create(null);
  const promises = [];
  // eslint-disable-next-line promise/param-names
  return new Promise((resolvePromise) => {
    dirTree(
      root,
      {
        exclude: [/node_modules/, /dist/, /docSite/],
        normalizePath: true,
      },
      (docFile) => {
        if (docFile.name.startsWith('docs.js')) {
          const doc = require(docFile.path);

          const fillDocs = (items, docs, name) => {
            items.forEach((entry) => {
              if (entry.items) {
                const childDocs = [];

                docs.push({
                  type: 'category',
                  label: entry.label || entry.name,
                  items: childDocs,
                });

                fillDocs(entry.items, childDocs, `${name}/${entry.name}`);
              } else if (entry.type) {
                // Ожидаются элементы из https://docusaurus.io/docs/sidebar#understanding-sidebar-items
                docs.push(entry);
              } else {
                const docName = `${name}/${entry.doc.id}`;

                const filePath = isRemotePath(entry.path)
                  ? entry.path
                  : resolve(docFile.path, '..', entry.path);

                const promise = copyFile(filePath, docName, entry.doc)
                  .then(() => {
                    priorities[docName] = entry.priority || 100;
                    docs.push(docName);
                  })
                  .catch((e) => {
                    console.warn(`Дока ${docName} не обнаружена по пути ${filePath}`);
                  });

                promises.push(promise);
              }
            });
          };

          toArray(doc).forEach((entry) => {
            const key = entry.label || entry.name;
            let nextDocs;
            if (docsResult[key]) {
              nextDocs = docsResult[key];
            } else {
              nextDocs = [];
              docsResult[key] = nextDocs;
            }

            fillDocs(entry.items, nextDocs, entry.name);
          });
        }
      }
    );

    Promise.all(promises).then(() => {
      resolvePromise(docsResult);
    });
  });
}

async function deleteTmpFolder() {
  await fs.remove(tempDocsPath);
}

async function writeSidebar(docsResult) {
  const docs = require('../baseSidebar');
  return fs.outputFile(
    'sidebars.json',
    JSON.stringify(
      {
        docs: {
          ...docs,
          ...mapObj((doc, key) => {
            const result = [...(docs[key] || [])];

            sortDocs(doc);

            doc.forEach((entry) => {
              if (typeof entry !== 'string') {
                const sameEntryIndex = result.findIndex(
                  (baseEntry) => baseEntry.label === entry.label
                );

                if (sameEntryIndex !== -1) {
                  result[sameEntryIndex] = {
                    ...result[sameEntryIndex],
                    ...entry,
                    items: uniq([...result[sameEntryIndex].items, ...entry.items]),
                  };
                  return;
                }
              }

              result.push(entry);
            });

            return uniq(result);
          }, docsResult),
        },
      },
      null,
      2
    ),
    'utf-8'
  );
}

async function main() {
  await deleteTmpFolder();
  await copyRootDocs();

  const docsResult = await collectAllProjectDocs();

  await writeSidebar(docsResult);
}

main();
