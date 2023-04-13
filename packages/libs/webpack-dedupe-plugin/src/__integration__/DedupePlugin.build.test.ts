import { resolve } from 'path';
import { readJSON, readFile } from 'fs-extra';
import { build } from '@tramvai/cli';

const rootDir = resolve(__dirname, '..', '__fixtures__', 'dedupe');
const statsPath = resolve(rootDir, 'dist', 'client', 'stats.json');

jest.setTimeout(160000);

const runBuild = async (target: string) => {
  await build({ target, rootDir });

  const {
    assetsByChunkName: { platform: platformFiles },
  } = await readJSON(statsPath);
  const platformJs = platformFiles.find((file: string) => file.endsWith('.js'));
  const platformCss = platformFiles.find((file: string) => file.endsWith('.css'));
  const platformJSContent = await readFile(resolve(rootDir, 'dist', 'client', platformJs), 'utf-8');
  const platformCssContent = await readFile(
    resolve(rootDir, 'dist', 'client', platformCss),
    'utf-8'
  );

  return {
    platformJSContent,
    platformCssContent,
  };
};
describe('DedupePlugin integration test', () => {
  it('no dedupe', async () => {
    const { platformJSContent, platformCssContent } = await runBuild('dedupe-no');

    expect(platformJSContent).toContain('_____package-1_____');
    expect(platformJSContent).toContain('_____package-2_____');
    expect(platformJSContent).toContain('_____package-3_____');
    expect(platformJSContent).toContain('_____dep-root_____');
    expect(platformJSContent).toContain('_____dep-pk1_____');
    expect(platformJSContent).toContain('_____dep-pk2_____');
    expect(platformJSContent).toContain('_____dep-pk3_____');
    expect(platformCssContent).toContain('_____dep-css-pk1_____');
    expect(platformCssContent).toContain('_____dep-css-pk2_____');
    expect(platformCssContent).toContain('_____dep-css-pk3_____');
    expect(platformJSContent).toContain('_____package-esm-1_____');
    expect(platformJSContent).toContain('_____package-esm-2_____');
    expect(platformJSContent).toContain('_____dep-esm-pk1_____');
    expect(platformJSContent).toContain('_____dep-esm-pk2_____');
  });

  it('dedupe=equality', async () => {
    const { platformJSContent, platformCssContent } = await runBuild('dedupe-eq');

    expect(platformJSContent).toContain('_____package-1_____');
    expect(platformJSContent).toContain('_____package-2_____');
    expect(platformJSContent).toContain('_____package-3_____');
    expect(platformJSContent).toContain('_____dep-root_____');
    expect(platformJSContent).toContain('_____dep-pk1_____');
    expect(platformJSContent).not.toContain('_____dep-pk2_____');
    expect(platformJSContent).toContain('_____dep-pk3_____');
    expect(platformCssContent).toContain('_____dep-css-pk1_____');
    expect(platformCssContent).not.toContain('_____dep-css-pk2_____');
    expect(platformCssContent).toContain('_____dep-css-pk3_____');
    expect(platformJSContent).toContain('_____package-esm-1_____');
    expect(platformJSContent).toContain('_____package-esm-2_____');
    expect(platformJSContent).toContain('_____dep-esm-pk1_____');
    expect(platformJSContent).toContain('_____dep-esm-pk2_____');
  });

  it('dedupe=semver', async () => {
    const { platformJSContent, platformCssContent } = await runBuild('dedupe-sem');

    expect(platformJSContent).toContain('_____package-1_____');
    expect(platformJSContent).toContain('_____package-2_____');
    expect(platformJSContent).toContain('_____package-3_____');
    expect(platformJSContent).not.toContain('_____dep-root_____');
    expect(platformJSContent).toContain('_____dep-pk1_____');
    expect(platformJSContent).not.toContain('_____dep-pk2_____');
    expect(platformJSContent).not.toContain('_____dep-pk3_____');
    expect(platformCssContent).toContain('_____dep-css-pk1_____');
    expect(platformCssContent).not.toContain('_____dep-css-pk2_____');
    expect(platformCssContent).not.toContain('_____dep-css-pk3_____');
    expect(platformJSContent).toContain('_____package-esm-1_____');
    expect(platformJSContent).toContain('_____package-esm-2_____');
    expect(platformJSContent).not.toContain('_____dep-esm-pk1_____');
    expect(platformJSContent).toContain('_____dep-esm-pk2_____');
  });

  it('dedupe=semver with ignore', async () => {
    const { platformJSContent, platformCssContent } = await runBuild('dedupe-ignore');

    expect(platformJSContent).toContain('_____package-1_____');
    expect(platformJSContent).toContain('_____package-2_____');
    expect(platformJSContent).toContain('_____package-3_____');
    expect(platformJSContent).toContain('_____dep-root_____');
    expect(platformJSContent).toContain('_____dep-pk1_____');
    expect(platformJSContent).toContain('_____dep-pk2_____');
    expect(platformJSContent).toContain('_____dep-pk3_____');
    expect(platformCssContent).toContain('_____dep-css-pk1_____');
    expect(platformCssContent).toContain('_____dep-css-pk2_____');
    expect(platformCssContent).toContain('_____dep-css-pk3_____');
    expect(platformJSContent).toContain('_____package-esm-1_____');
    expect(platformJSContent).toContain('_____package-esm-2_____');
    expect(platformJSContent).not.toContain('_____dep-esm-pk1_____');
    expect(platformJSContent).toContain('_____dep-esm-pk2_____');
  });
});
