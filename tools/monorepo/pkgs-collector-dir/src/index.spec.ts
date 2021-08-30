import { Collector } from './index';

function getFixtureDirPath(fixture) {
  return `${__dirname}/__fixtures__/${fixture}`;
}

describe('pkgs-collector-dir', () => {
  it('should work', async () => {
    process.chdir(getFixtureDirPath('monorepo'));
    const { allPkgs, affectedPkgs } = await Collector.collect({ pkgDirs: ['packages/*'] });
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
    process.chdir(getFixtureDirPath('monorepo'));
    await expect(Collector.collect({ pkgDirs: ['invalid_dir/*'] })).rejects.toEqual(
      new Error('No packages found for given patterns:\ninvalid_dir/*\n')
    );
  });
});
