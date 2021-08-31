import { resolve } from 'path';
import { node } from 'execa';
import { promises } from 'fs';

describe('tramvai-copy', () => {
  jest.setTimeout(60000);

  it('copy assets', async () => {
    const { files } = await copyAssetsAndReadOutput('copy-library');

    expect(files).toContain('style.css');
  });
});

async function copyAssetsAndReadOutput(name: string) {
  const cwd = resolve(__dirname, '__fixtures__', name);
  const outDir = resolve(cwd, 'lib');

  await node(resolve(__dirname, '../bin/tramvai-copy.js'), [], {
    cwd,
    stdio: 'inherit',
  });

  const files = await promises.readdir(outDir);

  return {
    files,
    readOutFile: (fileName: string) => promises.readFile(resolve(outDir, fileName), 'utf-8'),
  };
}
