import { resolve } from 'path';
import { command } from 'execa';
import { readJSON, readFile } from 'fs-extra';

const cwd = resolve(__dirname, '..', '__fixtures__', 'dedupe');
const statsPath = resolve(cwd, 'dist', 'client', 'stats.json');

jest.setTimeout(120000);

const runScript = async (scriptName: string) => {
  const result = await command(`yarn ${scriptName}`, { cwd });

  expect(result.exitCode).toBe(0);

  const {
    assetsByChunkName: {
      platform: [platform],
    },
  } = await readJSON(statsPath);
  const platformJSContent = await readFile(resolve(cwd, 'dist', 'client', platform), 'utf-8');

  return {
    platformJSContent,
  };
};
describe('DedupePlugin integration test', () => {
  it('no dedupe', async () => {
    const { platformJSContent } = await runScript('build');

    expect(platformJSContent).toContain('_____package-1_____');
    expect(platformJSContent).toContain('_____package-2_____');
    expect(platformJSContent).toContain('_____package-3_____');
    expect(platformJSContent).toContain('_____dep-root_____');
    expect(platformJSContent).toContain('_____dep-pk1_____');
    expect(platformJSContent).toContain('_____dep-pk2_____');
    expect(platformJSContent).toContain('_____dep-pk3_____');
    expect(platformJSContent).toContain('_____package-esm-1_____');
    expect(platformJSContent).toContain('_____package-esm-2_____');
    expect(platformJSContent).toContain('_____dep-esm-pk1_____');
    expect(platformJSContent).toContain('_____dep-esm-pk2_____');
  });

  it('dedupe=equality', async () => {
    const { platformJSContent } = await runScript('build-eq');

    expect(platformJSContent).toContain('_____package-1_____');
    expect(platformJSContent).toContain('_____package-2_____');
    expect(platformJSContent).toContain('_____package-3_____');
    expect(platformJSContent).toContain('_____dep-root_____');
    expect(platformJSContent).toContain('_____dep-pk1_____');
    expect(platformJSContent).not.toContain('_____dep-pk2_____');
    expect(platformJSContent).toContain('_____dep-pk3_____');
    expect(platformJSContent).toContain('_____package-esm-1_____');
    expect(platformJSContent).toContain('_____package-esm-2_____');
    expect(platformJSContent).toContain('_____dep-esm-pk1_____');
    expect(platformJSContent).toContain('_____dep-esm-pk2_____');
  });

  it('dedupe=semver', async () => {
    const { platformJSContent } = await runScript('build-sem');

    expect(platformJSContent).toContain('_____package-1_____');
    expect(platformJSContent).toContain('_____package-2_____');
    expect(platformJSContent).toContain('_____package-3_____');
    expect(platformJSContent).not.toContain('_____dep-root_____');
    expect(platformJSContent).toContain('_____dep-pk1_____');
    expect(platformJSContent).not.toContain('_____dep-pk2_____');
    expect(platformJSContent).not.toContain('_____dep-pk3_____');
    expect(platformJSContent).toContain('_____package-esm-1_____');
    expect(platformJSContent).toContain('_____package-esm-2_____');
    expect(platformJSContent).not.toContain('_____dep-esm-pk1_____');
    expect(platformJSContent).toContain('_____dep-esm-pk2_____');
  });

  it('dedupe=semver with ignore', async () => {
    const { platformJSContent } = await runScript('build-ignore');

    expect(platformJSContent).toContain('_____package-1_____');
    expect(platformJSContent).toContain('_____package-2_____');
    expect(platformJSContent).toContain('_____package-3_____');
    expect(platformJSContent).toContain('_____dep-root_____');
    expect(platformJSContent).toContain('_____dep-pk1_____');
    expect(platformJSContent).toContain('_____dep-pk2_____');
    expect(platformJSContent).toContain('_____dep-pk3_____');
    expect(platformJSContent).toContain('_____package-esm-1_____');
    expect(platformJSContent).toContain('_____package-esm-2_____');
    expect(platformJSContent).not.toContain('_____dep-esm-pk1_____');
    expect(platformJSContent).toContain('_____dep-esm-pk2_____');
  });
});
