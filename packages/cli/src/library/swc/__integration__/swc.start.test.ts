import { start } from '@tramvai/cli';
import { getStaticUrl } from '@tramvai/test-integration';
import type { PromiseType } from 'utility-types';
import fetch from 'node-fetch';

let app: PromiseType<ReturnType<typeof start>>;
let clientCode: string;
let serverCode: string;

const normalizeCode = (code: string) => {
  return code
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(new RegExp(__dirname, 'g'), '<project_dir>');
};

const getModuleCode = (code: string, name: string) => {
  const regexp = new RegExp(`swc/__integration__/${name}":.+?eval\\("(.+?)//# sourceURL=`, 's');

  const match = code.match(regexp);

  if (match) {
    return normalizeCode(match[1]);
  }

  throw new Error(`Module ${name} not found in code`);
};

beforeAll(async () => {
  app = await start({
    rootDir: __dirname,
    port: 0,
    staticPort: 0,
    strictErrorHandle: true,
    config: {
      name: 'swc-app',
      type: 'application',
      root: './',
      experiments: {
        transpilation: {
          loader: 'swc',
        },
      },
    },
  });

  const staticUrl = getStaticUrl(app);

  const platform = await fetch(`${staticUrl}/dist/client/platform.js`);

  clientCode = await platform.text();

  const server = await fetch(`${staticUrl}/dist/server/server.js`);

  serverCode = await server.text();
}, 180000);

afterAll(() => {
  return app.close();
});

const MODULES = [
  'create-token-pure.ts',
  'provider-stack.ts',
  'lazy-component.tsx',
  'typeof-window.ts',
  'node-env.ts',
  'server.inline.ts',
  'react-svg.tsx',
  'images/logo.svg\\?react',
];

for (const mod of MODULES) {
  // eslint-disable-next-line no-loop-func
  it(`client: ${mod}`, () => {
    expect(getModuleCode(clientCode, mod)).toMatchSnapshot();
  });

  // eslint-disable-next-line no-loop-func
  it(`server: ${mod}`, () => {
    expect(getModuleCode(serverCode, mod)).toMatchSnapshot();
  });
}
