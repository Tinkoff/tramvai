import { resolve, join } from 'path';
import { node } from 'execa';
import { promises } from 'fs';

describe('tramvai-build', () => {
  jest.setTimeout(60000);

  describe('base usage', () => {
    it('build default library', async () => {
      const { files, packageJson, readOutFile } = await buildLibAndReadOutput('library', {
        args: ['-p'],
      });

      expect(files).toEqual(['a.d.ts', 'b.d.ts', 'index.d.ts', 'index.es.js', 'index.js']);

      expect(packageJson.typings).toBe('lib/index.d.ts');
      expect(packageJson.module).toBe('lib/index.es.js');

      expect(await readOutFile('index.js')).toMatchInlineSnapshot(`
      "'use strict';

      Object.defineProperty(exports, '__esModule', { value: true });

      const a = async () => { };

      class B {
      }

      exports.B = B;
      exports.a = a;
      "
    `);
      expect(await readOutFile('index.es.js')).toMatchInlineSnapshot(`
      "const a = async () => { };

      class B {
      }

      export { B, a };
      "
    `);
    });

    it('copy assets', async () => {
      const { files } = await buildLibAndReadOutput('library-assets', { args: ['-p'] });

      expect(files).toContain('style.css');
    });

    it('lazy import', async () => {
      const { files, readOutFile } = await buildLibAndReadOutput('library-lazy', { args: ['-p'] });

      expect(files).toContain('index_lazy.js');
      expect(files).toContain('index_lazy.es.js');

      expect(await readOutFile('index.js')).toMatchInlineSnapshot(`
      "'use strict';

      Object.defineProperty(exports, '__esModule', { value: true });

      const load = () => Promise.resolve().then(function () { return require('./index_lazy.js'); });

      exports.load = load;
      "
    `);
      expect(await readOutFile('index.es.js')).toMatchInlineSnapshot(`
      "const load = () => import('./index_lazy.es.js');

      export { load };
      "
    `);
      expect(await readOutFile('index_lazy.js')).toMatchInlineSnapshot(`
      "'use strict';

      const lazy = 123;

      exports.lazy = lazy;
      "
    `);
      expect(await readOutFile('index_lazy.es.js')).toMatchInlineSnapshot(`
      "const lazy = 123;

      export { lazy };
      "
    `);
    });

    it('require', async () => {
      const { files, readOutFile } = await buildLibAndReadOutput('library-require', {
        args: ['-p'],
      });

      expect(files).toContain('index_req.js');
      expect(files).toContain('index_req.es.js');

      expect(await readOutFile('index.js')).toMatchInlineSnapshot(`
      "'use strict';

      Object.defineProperty(exports, '__esModule', { value: true });

      const foo = require('./index_req.js');

      exports.foo = foo;
      "
    `);
      expect(await readOutFile('index.es.js')).toMatchInlineSnapshot(`
      "const foo = require('./index_req.es.js');

      export { foo };
      "
    `);
      expect(await readOutFile('index_req.js')).toMatchInlineSnapshot(`
      "'use strict';

      Object.defineProperty(exports, '__esModule', { value: true });

      const req = 'bar';

      exports.req = req;
      "
    `);
      expect(await readOutFile('index_req.es.js')).toMatchInlineSnapshot(`
      "const req = 'bar';

      export { req };
      "
    `);
    });

    it('migrations', async () => {
      const {
        migrationFiles,
        readMigrationFile,
      } = await buildLibAndReadOutput('library-migrations', { args: ['-p'] });

      expect(migrationFiles).toContain('1.js');

      expect(await readMigrationFile('1.js')).toMatchInlineSnapshot(`
      "'use strict';

      var tslib = require('tslib');

      var _1 = (function () { return tslib.__awaiter(void 0, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
          return [2 /*return*/];
      }); }); });

      module.exports = _1;
      "
    `);
    });

    it('browser field - object', async () => {
      const {
        files,
        packageJson,
        readOutFile,
      } = await buildLibAndReadOutput('library-browser-object', { args: ['-p'] });

      expect(files).toContain('index.browser.js');

      expect(packageJson.browser).toMatchObject({
        './lib/external.js': './lib/external.browser.js',
        './lib/nested/foo.server.js': './lib/nested/foo.browser.js',
        './lib/index.es.js': './lib/index.browser.js',
      });

      expect(await readOutFile('index.js')).toMatchInlineSnapshot(`
"'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const test = 'test';

console.log(test);
const external = 'external server';

const testNested = 'server test nested';

console.log(testNested);
const foo = \`bar \${external}\`;

exports.foo = foo;
"
`);
      expect(await readOutFile('index.es.js')).toMatchInlineSnapshot(`
"const test = 'test';

console.log(test);
const external = 'external server';

const testNested = 'server test nested';

console.log(testNested);
const foo = \`bar \${external}\`;

export { foo };
"
`);
      expect(await readOutFile('index.browser.js')).toMatchInlineSnapshot(`
"const test = 'test';

console.log(test);
const external = 'external browser';

const testNested = 'browser test nested';

console.log(testNested);
const foo = \`bar \${external}\`;

export { foo };
"
`);
    });

    it('browser field - string', async () => {
      const {
        files,
        packageJson,
        readOutFile,
      } = await buildLibAndReadOutput('library-browser-string', { args: ['-p'] });

      expect(files).toContain('server.js');
      expect(files).toContain('server.es.js');
      expect(files).toContain('browser.js');

      expect(packageJson.typings).toBe('lib/server.d.ts');
      expect(packageJson.module).toBe('lib/server.es.js');
      expect(packageJson.browser).toBe('lib/browser.js');

      expect(await readOutFile('server.js')).toMatchInlineSnapshot(`
"'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const test = 'test';

console.log(test);
const foo = 'server';

exports.foo = foo;
"
`);
      expect(await readOutFile('server.es.js')).toMatchInlineSnapshot(`
"const test = 'test';

console.log(test);
const foo = 'server';

export { foo };
"
`);
      expect(await readOutFile('browser.js')).toMatchInlineSnapshot(`
"const test = 'test';

console.log(test);
const foo = 'browser';

export { foo };
"
`);
    });

    it('browser field - string - index file', async () => {
      const {
        files,
        packageJson,
        readOutFile,
      } = await buildLibAndReadOutput('library-browser-string-index', { args: ['-p'] });

      expect(files).toContain('index.js');
      expect(files).toContain('index.es.js');
      expect(files).toContain('index.browser.js');

      expect(packageJson.typings).toBe('lib/index.d.ts');
      expect(packageJson.module).toBe('lib/index.es.js');
      expect(packageJson.browser).toBe('lib/index.browser.js');

      expect(await readOutFile('index.js')).toMatchInlineSnapshot(`
"'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const test = 'test';

console.log(test);
const foo = 'server';

exports.foo = foo;
"
`);
      expect(await readOutFile('index.es.js')).toMatchInlineSnapshot(`
"const test = 'test';

console.log(test);
const foo = 'server';

export { foo };
"
`);
      expect(await readOutFile('index.browser.js')).toMatchInlineSnapshot(`
"const test = 'test';

console.log(test);
const foo = 'browser';

export { foo };
"
`);
    });
  });

  describe('preserve-modules', () => {
    it('build default library', async () => {
      const { files, packageJson, readOutFile } = await buildLibAndReadOutput('library', {
        args: ['-p', '--preserve-modules'],
      });

      expect(files).toEqual([
        'a.d.ts',
        'a.es.js',
        'a.js',
        'b.d.ts',
        'b.es.js',
        'b.js',
        'index.d.ts',
        'index.es.js',
        'index.js',
      ]);

      expect(packageJson.typings).toBe('lib/index.d.ts');
      expect(packageJson.module).toBe('lib/index.es.js');

      expect(await readOutFile('index.js')).toMatchInlineSnapshot(`
  "'use strict';

  Object.defineProperty(exports, '__esModule', { value: true });

  var a = require('./a.js');
  var b = require('./b.js');



  exports.a = a.a;
  exports.B = b.B;
  "
  `);
      expect(await readOutFile('a.js')).toMatchInlineSnapshot(`
  "'use strict';

  Object.defineProperty(exports, '__esModule', { value: true });

  const a = async () => { };

  exports.a = a;
  "
  `);
      expect(await readOutFile('b.js')).toMatchInlineSnapshot(`
  "'use strict';

  Object.defineProperty(exports, '__esModule', { value: true });

  class B {
  }

  exports.B = B;
  "
  `);
      expect(await readOutFile('index.es.js')).toMatchInlineSnapshot(`
  "export { a } from './a.es.js';
  export { B } from './b.es.js';
  "
  `);
      expect(await readOutFile('a.es.js')).toMatchInlineSnapshot(`
  "const a = async () => { };

  export { a };
  "
  `);
      expect(await readOutFile('b.es.js')).toMatchInlineSnapshot(`
  "class B {
  }

  export { B };
  "
  `);
    });

    it('copy assets', async () => {
      const { files } = await buildLibAndReadOutput('library-assets', {
        args: ['-p', '--preserve-modules'],
      });

      expect(files).toContain('style.css');
    });

    it('lazy import', async () => {
      const { files, readOutFile } = await buildLibAndReadOutput('library-lazy', {
        args: ['-p', '--preserve-modules'],
      });

      expect(files).toContain('lazy.js');
      expect(files).toContain('lazy.es.js');

      expect(await readOutFile('index.js')).toMatchInlineSnapshot(`
  "'use strict';

  Object.defineProperty(exports, '__esModule', { value: true });

  const load = () => Promise.resolve().then(function () { return require('./lazy.js'); });

  exports.load = load;
  "
  `);
      expect(await readOutFile('index.es.js')).toMatchInlineSnapshot(`
  "const load = () => import('./lazy.es.js');

  export { load };
  "
  `);
      expect(await readOutFile('lazy.js')).toMatchInlineSnapshot(`
  "'use strict';

  Object.defineProperty(exports, '__esModule', { value: true });

  const lazy = 123;

  exports.lazy = lazy;
  "
  `);
      expect(await readOutFile('lazy.es.js')).toMatchInlineSnapshot(`
  "const lazy = 123;

  export { lazy };
  "
  `);
    });

    it('require', async () => {
      const { files, readOutFile } = await buildLibAndReadOutput('library-require', {
        args: ['-p', '--preserve-modules'],
      });

      expect(files).toContain('req.js');
      expect(files).toContain('req.es.js');

      expect(await readOutFile('index.js')).toMatchInlineSnapshot(`
        "'use strict';

        Object.defineProperty(exports, '__esModule', { value: true });

        const foo = require('./req.js');

        exports.foo = foo;
        "
      `);
      expect(await readOutFile('index.es.js')).toMatchInlineSnapshot(`
        "const foo = require('./req.es.js');

        export { foo };
        "
      `);
      expect(await readOutFile('req.js')).toMatchInlineSnapshot(`
        "'use strict';

        Object.defineProperty(exports, '__esModule', { value: true });

        const req = 'bar';

        exports.req = req;
        "
      `);
      expect(await readOutFile('req.es.js')).toMatchInlineSnapshot(`
        "const req = 'bar';

        export { req };
        "
      `);
    });

    it('migrations', async () => {
      const { migrationFiles, readMigrationFile } = await buildLibAndReadOutput(
        'library-migrations',
        {
          args: ['-p', '--preserve-modules'],
        }
      );

      expect(migrationFiles).toContain('1.js');

      expect(await readMigrationFile('1.js')).toMatchInlineSnapshot(`
        "'use strict';

        var tslib = require('tslib');

        var _1 = (function () { return tslib.__awaiter(void 0, void 0, void 0, function () { return tslib.__generator(this, function (_a) {
            return [2 /*return*/];
        }); }); });

        module.exports = _1;
        "
      `);
    });

    it('browser field - object', async () => {
      const { files, packageJson, readOutFile } = await buildLibAndReadOutput(
        'library-browser-object',
        {
          args: ['-p', '--preserve-modules'],
        }
      );

      expect(files).toContain('index.js');
      expect(files).toContain('index.es.js');
      expect(files).toContain('index.browser.js');
      expect(files).toContain('external.js');
      expect(files).toContain('external.es.js');
      expect(files).toContain('external.browser.browser.js');
      expect(files).toContain('foo.js');
      expect(files).toContain('foo.es.js');
      expect(files).toContain('foo.browser.js');
      expect(files).toContain('nested/foo.server.js');
      expect(files).toContain('nested/foo.server.es.js');
      expect(files).toContain('nested/foo.browser.browser.js');

      expect(packageJson.browser).toMatchObject({
        './lib/external.js': './lib/external.browser.js',
        './lib/nested/foo.server.js': './lib/nested/foo.browser.js',
        './lib/index.es.js': './lib/index.browser.js',
      });

      expect(await readOutFile('index.js')).toMatchInlineSnapshot(`
"'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var external = require('./external.js');
var foo_server = require('./nested/foo.server.js');

console.log(foo_server.testNested);
const foo = \`bar \${external.external}\`;

exports.foo = foo;
"
`);
      expect(await readOutFile('external.js')).toMatchInlineSnapshot(`
"'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var foo = require('./foo.js');

console.log(foo.test);
const external = 'external server';

exports.external = external;
"
`);
      expect(await readOutFile('index.es.js')).toMatchInlineSnapshot(`
"import { external } from './external.es.js';
import { testNested } from './nested/foo.server.es.js';

console.log(testNested);
const foo = \`bar \${external}\`;

export { foo };
"
`);
      expect(await readOutFile('external.es.js')).toMatchInlineSnapshot(`
"import { test } from './foo.es.js';

console.log(test);
const external = 'external server';

export { external };
"
`);
      expect(await readOutFile('index.browser.js')).toMatchInlineSnapshot(`
"import { external } from './external.browser.browser.js';
import { testNested } from './nested/foo.browser.browser.js';

console.log(testNested);
const foo = \`bar \${external}\`;

export { foo };
"
`);
      expect(await readOutFile('external.browser.browser.js')).toMatchInlineSnapshot(`
"import { test } from './foo.browser.js';

console.log(test);
const external = 'external browser';

export { external };
"
`);

      expect(await readOutFile('foo.js')).toMatchInlineSnapshot(`
"'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const test = 'test';

exports.test = test;
"
`);
      expect(await readOutFile('foo.es.js')).toMatchInlineSnapshot(`
"const test = 'test';

export { test };
"
`);
      expect(await readOutFile('foo.browser.js')).toMatchInlineSnapshot(`
"const test = 'test';

export { test };
"
`);

      expect(await readOutFile('nested/foo.server.js')).toMatchInlineSnapshot(`
"'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const testNested = 'server test nested';

exports.testNested = testNested;
"
`);
      expect(await readOutFile('nested/foo.server.es.js')).toMatchInlineSnapshot(`
"const testNested = 'server test nested';

export { testNested };
"
`);
      expect(await readOutFile('nested/foo.browser.browser.js')).toMatchInlineSnapshot(`
"const testNested = 'browser test nested';

export { testNested };
"
`);
    });

    it('browser field - string', async () => {
      const { files, packageJson, readOutFile } = await buildLibAndReadOutput(
        'library-browser-string',
        {
          args: ['-p', '--preserve-modules'],
        }
      );

      expect(files).toContain('server.js');
      expect(files).toContain('server.es.js');
      expect(files).toContain('browser.js');
      expect(files).toContain('foo.js');
      expect(files).toContain('foo.es.js');
      expect(files).toContain('foo.browser.js');

      expect(packageJson.typings).toBe('lib/server.d.ts');
      expect(packageJson.module).toBe('lib/server.es.js');
      expect(packageJson.browser).toBe('lib/browser.js');

      expect(await readOutFile('server.js')).toMatchInlineSnapshot(`
"'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var foo$1 = require('./foo.js');

console.log(foo$1.test);
const foo = 'server';

exports.foo = foo;
"
`);
      expect(await readOutFile('server.es.js')).toMatchInlineSnapshot(`
"import { test } from './foo.es.js';

console.log(test);
const foo = 'server';

export { foo };
"
`);
      expect(await readOutFile('browser.js')).toMatchInlineSnapshot(`
"import { test } from './foo.browser.js';

console.log(test);
const foo = 'browser';

export { foo };
"
`);

      expect(await readOutFile('foo.js')).toMatchInlineSnapshot(`
"'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const test = 'test';

exports.test = test;
"
`);
      expect(await readOutFile('foo.es.js')).toMatchInlineSnapshot(`
"const test = 'test';

export { test };
"
`);
      expect(await readOutFile('foo.browser.js')).toMatchInlineSnapshot(`
"const test = 'test';

export { test };
"
`);
    });

    it('browser field - string - index', async () => {
      const { files, packageJson, readOutFile } = await buildLibAndReadOutput(
        'library-browser-string-index',
        {
          args: ['-p', '--preserve-modules'],
        }
      );

      expect(files).toContain('index.js');
      expect(files).toContain('index.es.js');
      expect(files).toContain('index.browser.js');
      expect(files).toContain('foo.js');
      expect(files).toContain('foo.es.js');
      expect(files).toContain('foo.browser.js');

      expect(packageJson.typings).toBe('lib/index.d.ts');
      expect(packageJson.module).toBe('lib/index.es.js');
      expect(packageJson.browser).toBe('lib/index.browser.js');

      expect(await readOutFile('index.js')).toMatchInlineSnapshot(`
"'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var foo$1 = require('./foo.js');

console.log(foo$1.test);
const foo = 'server';

exports.foo = foo;
"
`);
      expect(await readOutFile('index.es.js')).toMatchInlineSnapshot(`
"import { test } from './foo.es.js';

console.log(test);
const foo = 'server';

export { foo };
"
`);
      expect(await readOutFile('index.browser.js')).toMatchInlineSnapshot(`
"import { test } from './foo.browser.js';

console.log(test);
const foo = 'browser';

export { foo };
"
`);

      expect(await readOutFile('foo.js')).toMatchInlineSnapshot(`
"'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const test = 'test';

exports.test = test;
"
`);
      expect(await readOutFile('foo.es.js')).toMatchInlineSnapshot(`
"const test = 'test';

export { test };
"
`);
      expect(await readOutFile('foo.browser.js')).toMatchInlineSnapshot(`
"const test = 'test';

export { test };
"
`);
    });
  });
});

async function buildLibAndReadOutput(name: string, { args = [] }: { args?: string[] } = {}) {
  const cwd = resolve(__dirname, '__fixtures__', name);
  const outDir = resolve(cwd, 'lib');
  const migrationsDir = resolve(cwd, '__migrations__');
  const packageJsonPath = resolve(cwd, 'package.json');
  const initialPackageJson = JSON.parse(await promises.readFile(packageJsonPath, 'utf-8'));

  await node(resolve(__dirname, '../bin/tramvai-build.js'), args, {
    cwd,
    stdio: 'inherit',
  });

  const [files, migrationFiles, packageJson] = await Promise.all([
    traverseDir(outDir),
    promises.readdir(migrationsDir).catch(() => []),
    promises.readFile(packageJsonPath, 'utf-8').then(JSON.parse),
  ]);

  // откатываем package.json до начального состояния, чтобы протестировать изменения в нём
  await promises.writeFile(packageJsonPath, JSON.stringify(initialPackageJson, null, 2));

  return {
    files,
    migrationFiles,
    packageJson,
    initialPackageJson,
    readOutFile: (fileName: string) => promises.readFile(resolve(outDir, fileName), 'utf-8'),
    readMigrationFile: (fileName: string) =>
      promises.readFile(resolve(migrationsDir, fileName), 'utf-8'),
  };
}

async function traverseDir(
  dir: string,
  result: string[] = [],
  relativeDir = ''
): Promise<string[]> {
  const files = await promises.readdir(dir);

  for (const file of files) {
    const fullPath = join(dir, file);

    if ((await promises.lstat(fullPath)).isDirectory()) {
      await traverseDir(fullPath, result, file);
    } else {
      result.push(join(relativeDir, file));
    }
  }

  return result;
}
