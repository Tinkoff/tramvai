import { resolve } from 'path';
import fetch from 'node-fetch';
import { start } from '@tramvai/cli';
import { getStaticUrl } from '@tramvai/test-integration';

const rootDir = resolve(__dirname, '..', '__fixtures__', 'dedupe');

jest.setTimeout(160000);

const runStart = async (target: string) => {
  const cliResult = await start({ target, rootDir });
  const staticUrl = getStaticUrl(cliResult);

  const [platformJSContent, platformCssContent] = await Promise.all([
    fetch(`${staticUrl}/dist/client/platform.js`).then((r) => r.text()),
    fetch(`${staticUrl}/dist/client/platform.css`).then((r) => r.text()),
  ]);

  await cliResult.close();

  return {
    platformJSContent,
    platformCssContent,
  };
};
describe('DedupePlugin integration test', () => {
  it('no dedupe', async () => {
    const { platformJSContent, platformCssContent } = await runStart('dedupe-no');

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
    const { platformJSContent, platformCssContent } = await runStart('dedupe-eq');

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
    const { platformJSContent, platformCssContent } = await runStart('dedupe-sem');

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
    const { platformJSContent, platformCssContent } = await runStart('dedupe-ignore');

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
