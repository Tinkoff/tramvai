import { resolve } from 'path';
import supertest from 'supertest';
import { start } from '@tramvai/cli';
import { getPort } from '@tramvai/internal-test-utils/utils/getPort';
import { getListeningPort } from '../utils/getListeningPort';

const FIXTURES_DIR = resolve(__dirname, '__fixtures__');

jest.useRealTimers();
jest.setTimeout(80000);

const supertestByPort = (port: number) => {
  return supertest(`http://localhost:${port}`);
};

describe('@tramvai/cli start command', () => {
  describe('application', () => {
    it('should start application by target', async () => {
      const serverPort = await getPort();
      const staticServerPort = await getPort();

      const { server, staticServer, close } = await start({
        rootDir: FIXTURES_DIR,
        target: 'app',
        resolveSymlinks: false,
        port: serverPort,
        staticPort: staticServerPort,
      });

      expect(server.address()).toMatchObject({
        port: serverPort,
      });
      expect(staticServer.address()).toMatchObject({
        port: staticServerPort,
      });

      const responseServer = await supertestByPort(serverPort).get('/').expect(200);

      expect(responseServer.text)
        .toMatch(`<link rel=\"stylesheet\" href=\"http://localhost:${staticServerPort}/dist/client/platform.css\">
      <script src=\"http://localhost:${staticServerPort}/dist/client/hmr.js\" defer></script>
      <script src=\"http://localhost:${staticServerPort}/dist/client/platform.js\" defer></script>`);
      expect(responseServer.text).toMatch(`this is App`);

      const testStatic = supertestByPort(staticServerPort);
      await testStatic.get('/dist/client/platform.js').expect(200);
      await testStatic.get('/dist/server/server.js').expect(200);

      return close();
    });

    it('should start application from config', async () => {
      const serverPort = await getPort();
      const staticServerPort = await getPort();

      const root = resolve(FIXTURES_DIR, 'app');
      const { server, staticServer, close } = await start({
        rootDir: root,
        resolveSymlinks: false,
        port: serverPort,
        staticPort: staticServerPort,
        config: {
          name: 'app',
          type: 'application',
          root,
          commands: {
            build: {
              options: {
                server: resolve(root, 'server.tsx'),
              },
            },
          },
        },
      });

      expect(server.address()).toMatchObject({
        port: serverPort,
      });
      expect(staticServer.address()).toMatchObject({
        port: staticServerPort,
      });

      const responseServer = await supertestByPort(serverPort).get('/').expect(200);

      expect(responseServer.text)
        .toMatch(`<link rel=\"stylesheet\" href=\"http://localhost:${staticServerPort}/dist/client/platform.css\">
      <script src=\"http://localhost:${staticServerPort}/dist/client/hmr.js\" defer></script>
      <script src=\"http://localhost:${staticServerPort}/dist/client/platform.js\" defer></script>`);
      expect(responseServer.text).toMatch(`this is App`);

      const testStatic = supertestByPort(staticServerPort);
      await testStatic.get('/dist/client/platform.js').expect(200);
      await testStatic.get('/dist/server/server.js').expect(200);

      return close();
    });

    it('should start server on random ports', async () => {
      const { server, staticServer, close } = await start({
        rootDir: FIXTURES_DIR,
        target: 'app',
        port: 0,
        staticPort: 0,
        resolveSymlinks: false,
      });

      expect(server.address()).toMatchObject({
        port: expect.any(Number),
      });
      expect(staticServer.address()).toMatchObject({
        port: expect.any(Number),
      });

      await supertestByPort(getListeningPort(server)).get('/').expect(200);

      const testStatic = supertestByPort(getListeningPort(staticServer));
      await testStatic.get('/dist/client/platform.js').expect(200);
      await testStatic.get('/dist/server/server.js').expect(200);

      return close();
    });

    it('should allow to exclude bundles from build', async () => {
      let { server, close } = await start({
        rootDir: FIXTURES_DIR,
        target: 'app',
        resolveSymlinks: false,
        port: 0,
        staticPort: 0,
      });

      let testServer = supertestByPort(getListeningPort(server));

      await testServer.get('/?bundle=main').expect(200);
      await testServer.get('/?bundle=first').expect(200);
      await testServer.get('/?bundle=second').expect(200);
      await testServer.get('/?bundle=third').expect(200);

      await close();

      ({ server, close } = await start({
        rootDir: FIXTURES_DIR,
        target: 'app',
        resolveSymlinks: false,
        onlyBundles: ['main', 'second'],
        port: 0,
        staticPort: 0,
      }));

      testServer = supertestByPort(getListeningPort(server));

      await testServer.get('/?bundle=main').expect(200);
      await testServer.get('/?bundle=first').expect(500);
      await testServer.get('/?bundle=second').expect(200);
      await testServer.get('/?bundle=third').expect(500);

      return close();
    });
  });

  describe('module', () => {
    it('should start module by target', async () => {
      const { staticServer, close } = await start({
        rootDir: FIXTURES_DIR,
        target: 'module',
        resolveSymlinks: false,
        port: 0,
      });

      const testStatic = supertestByPort(getListeningPort(staticServer));

      await testStatic.get('/module/0.1.0/module_server.js').expect(200);
      await testStatic.get('/module/0.1.0/module_client.js').expect(200);

      return close();
    });

    it('should start module by specific config', async () => {
      const staticServerPort = await getPort();

      const { staticServer, close } = await start({
        config: {
          type: 'module',
          name: 'module',
          root: resolve(FIXTURES_DIR, 'module'),
        },
        port: staticServerPort,
      });

      expect(staticServer.address()).toMatchObject({
        port: staticServerPort,
      });

      const testStatic = supertestByPort(staticServerPort);

      await testStatic.get('/module/0.1.0/module_server.js').expect(200);
      await testStatic.get('/module/0.1.0/module_client.js').expect(200);

      return close();
    });
  });
});
