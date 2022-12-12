import * as path from 'path';
import { promises as fs } from 'fs';
import { build } from '@tramvai/cli';

let clientCode: string;
let clientModernCode: string;
let serverCode: string;

const getModuleCode = (code: string, name: string) => {
  const regexp = new RegExp(`swc/__integration__/${name}":\\s*\n.+?{\n(.+?)/\\*{3}/\\s`, 's');

  const match = code.match(regexp);

  if (match) {
    return match[1];
  }

  throw new Error(`Module ${name} not found in code`);
};

beforeAll(async () => {
  await build({
    rootDir: __dirname,
    disableProdOptimization: true,
    config: {
      name: 'swc-app',
      type: 'application',
      root: './',
      commands: {
        build: {
          options: {
            server: 'index.ts',
          },
          configurations: {
            experiments: {
              transpilation: {
                loader: 'swc',
              },
            },
          },
        },
        serve: {
          configurations: {
            experiments: {
              transpilation: {
                loader: 'swc',
              },
            },
          },
        },
      },
    },
  });

  const distRoot = path.resolve(__dirname, 'dist');

  serverCode = await fs.readFile(path.resolve(distRoot, 'server/server.js'), 'utf-8');

  const stats = require(path.resolve(distRoot, 'client/stats.json'));
  const modernStats = require(path.resolve(distRoot, 'client/stats.modern.json'));

  clientCode = await fs.readFile(
    path.resolve(distRoot, 'client', stats.assetsByChunkName.platform[0]),
    'utf-8'
  );

  clientModernCode = await fs.readFile(
    path.resolve(distRoot, 'client', modernStats.assetsByChunkName.platform[0]),
    'utf-8'
  );
}, 180000);

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
  it(`client-legacy: ${mod}`, () => {
    expect(getModuleCode(clientCode, mod)).toMatchSnapshot();
  });

  // eslint-disable-next-line no-loop-func
  it(`client-modern: ${mod}`, () => {
    expect(getModuleCode(clientModernCode, mod)).toMatchSnapshot();
  });

  // eslint-disable-next-line no-loop-func
  it(`server: ${mod}`, () => {
    expect(getModuleCode(serverCode, mod)).toMatchSnapshot();
  });
}
