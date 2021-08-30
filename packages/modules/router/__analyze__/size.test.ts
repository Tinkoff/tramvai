import mergeDeep from '@tinkoff/utils/object/mergeDeep';
import { resolve } from 'path';
import { promises } from 'fs';
import type { StatsCompilation } from 'webpack';
import { build as cliBuild } from '@tramvai/cli';
import type { UnionToIntersection } from 'utility-types';

type BuildConfig = UnionToIntersection<Parameters<typeof cliBuild>[0]>['config'];

const build = async (config: Partial<BuildConfig> & { name: string; root: string }) => {
  const rootDir = resolve(__dirname, config.name);

  await cliBuild({
    config: mergeDeep(
      {
        name: `router-${config.name}`,
        type: 'application',
        commands: {
          build: {
            options: {
              server: config.root,
            },
          },
        },
      },
      config
    ),
    rootDir,
    buildType: 'client',
    resolveSymlinks: false,
    disableProdOptimization: true,
  });

  const distPath = resolve(rootDir, 'dist', 'client');
  const stats: StatsCompilation = require(resolve(distPath, 'stats.json'));

  return {
    async getChunkFile(chunkName: string) {
      const chunkFileName = stats.assetsByChunkName[chunkName].find((filename) =>
        filename.endsWith('.js')
      );

      const chunk = await promises.readFile(resolve(distPath, chunkFileName), 'utf-8');

      return chunk;
    },
  };
};

describe('router', () => {
  it('no-spa', async () => {
    const { getChunkFile } = await build({
      name: 'no-spa',
      root: resolve(__dirname, '..', '__integration__', 'no-spa'),
    });

    const platform = await getChunkFile('platform');

    expect(platform).not.toContain('spaHooks');
    expect(platform).not.toContain('resolveIfDelayFound');
    expect(platform).not.toMatch(/\WRouter\W/);
    expect(platform).toMatch(/\WNoSpaRouter\W/);
  });

  it('spa', async () => {
    const { getChunkFile } = await build({
      name: 'spa',
      root: resolve(__dirname, '..', '__integration__', 'spa'),
    });

    const platform = await getChunkFile('platform');

    expect(platform).toContain('spaHooks');
    expect(platform).toContain('resolveIfDelayFound');
    expect(platform).toMatch(/\WRouter\W/);
    expect(platform).not.toMatch(/\WNoSpaRouter\W/);
  });
});
