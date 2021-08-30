import { Collector } from './index';

function getFixtureDirPath(fixture) {
  return `${__dirname}/__fixtures__/${fixture}`;
}

describe('pkgs-collector-dir', () => {
  it('should work', async () => {
    process.chdir(getFixtureDirPath('monorepo'));
    const { allPkgs, affectedPkgs } = await Collector.collect();
    expect(allPkgs.length).toBe(1);
    expect(affectedPkgs.length).toBe(1);
    expect(allPkgs[0]).toMatchObject({
      name: 'a',
    });
    expect(affectedPkgs[0]).toMatchObject({
      name: 'a',
    });
  });

  it('should work with "packages" syntax', async () => {
    process.chdir(getFixtureDirPath('monorepo-packages-syntax'));
    const { allPkgs, affectedPkgs } = await Collector.collect();
    expect(allPkgs.length).toBe(1);
    expect(affectedPkgs.length).toBe(1);
    expect(allPkgs[0]).toMatchObject({
      name: 'a',
    });
    expect(affectedPkgs[0]).toMatchObject({
      name: 'a',
    });
  });

  it('should throw if no packages found', async () => {
    process.chdir(getFixtureDirPath('emptyMonorepo'));
    await expect(Collector.collect()).rejects.toEqual(
      new Error('No packages found in workspaces:\npackages/*\n')
    );
  });
});
