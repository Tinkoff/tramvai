import { resolve } from 'path';
import { node } from 'execa';
import { promises } from 'fs';

describe('tramvai-build', () => {
  jest.setTimeout(60000);

  it('build default library', async () => {
    const { files, packageJson, readOutFile } = await buildLibAndReadOutput('library');

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
    const { files } = await buildLibAndReadOutput('library-assets');

    expect(files).toContain('style.css');
  });

  it('lazy import', async () => {
    const { files, readOutFile } = await buildLibAndReadOutput('library-lazy');

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
    const { files, readOutFile } = await buildLibAndReadOutput('library-require');

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
    const { migrationFiles, readMigrationFile } = await buildLibAndReadOutput('library-migrations');

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
      'library-browser-object'
    );

    expect(files).toContain('index.browser.js');

    expect(packageJson.browser).toMatchObject({
      './lib/external.js': './lib/external.browser.js',
      './lib/index.es.js': './lib/index.browser.js',
    });

    expect(await readOutFile('index.js')).toMatchInlineSnapshot(`
      "'use strict';

      Object.defineProperty(exports, '__esModule', { value: true });

      const external = 'external server';

      const foo = \`bar \${external}\`;

      exports.foo = foo;
      "
    `);
    expect(await readOutFile('index.es.js')).toMatchInlineSnapshot(`
      "const external = 'external server';

      const foo = \`bar \${external}\`;

      export { foo };
      "
    `);
    expect(await readOutFile('index.browser.js')).toMatchInlineSnapshot(`
      "const external = 'external browser';

      const foo = \`bar \${external}\`;

      export { foo };
      "
    `);
  });

  it('browser field - string', async () => {
    const { files, packageJson, readOutFile } = await buildLibAndReadOutput(
      'library-browser-string'
    );

    expect(files).toContain('server.js');
    expect(files).toContain('server.es.js');
    expect(files).toContain('browser.js');

    expect(packageJson.typings).toBe('lib/server.d.ts');
    expect(packageJson.module).toBe('lib/server.es.js');

    expect(await readOutFile('server.js')).toMatchInlineSnapshot(`
      "'use strict';

      Object.defineProperty(exports, '__esModule', { value: true });

      const foo = 'server';

      exports.foo = foo;
      "
    `);
    expect(await readOutFile('server.es.js')).toMatchInlineSnapshot(`
      "const foo = 'server';

      export { foo };
      "
    `);
    expect(await readOutFile('browser.js')).toMatchInlineSnapshot(`
      "const foo = 'browser';

      export { foo };
      "
    `);
  });
});

async function buildLibAndReadOutput(name: string) {
  const cwd = resolve(__dirname, '__fixtures__', name);
  const outDir = resolve(cwd, 'lib');
  const migrationsDir = resolve(cwd, '__migrations__');
  const packageJsonPath = resolve(cwd, 'package.json');
  const initialPackageJson = JSON.parse(await promises.readFile(packageJsonPath, 'utf-8'));

  await node(resolve(__dirname, '../bin/tramvai-build.js'), ['-p'], {
    cwd,
    stdio: 'inherit',
  });

  const [files, migrationFiles, packageJson] = await Promise.all([
    promises.readdir(outDir),
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
