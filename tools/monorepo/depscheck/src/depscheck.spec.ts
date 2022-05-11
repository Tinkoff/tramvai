import { depscheck } from './depscheck';
import { logger } from './logger';
import type { CollectorInterface } from './types';

function getConfigWithCollector(allPkgs: string[], affectedPkgs: string[]) {
  const collector: CollectorInterface = {
    name: 'test',
    // @ts-ignore
    async collect() {
      return {
        allPkgs: allPkgs.map(getPvmPkgMock),
        affectedPkgs: affectedPkgs.map(getPvmPkgMock),
      };
    },
  };

  return {
    collector: collector.collect,
  };
}

jest.mock('./logger');
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
}));

function getPvmPkgMock(pkgName: string) {
  const pkgAbsPath = `${__dirname}/__fixtures__/${pkgName}`;
  const manifestPath = `${pkgAbsPath}/package.json`;
  const pkgMeta = require(manifestPath);
  return {
    name: pkgName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .split('/')
      .pop(),
    version: pkgMeta.version,
    absPath: pkgAbsPath,
    meta: pkgMeta,
    manifestPath,
    path: pkgAbsPath,
  };
}

function checkMessage(msg: string) {
  // @ts-ignore
  return logger.error.mock.calls.find(([...args]) => args.join(' ').indexOf(msg) !== -1);
}

describe('depscheck', () => {
  afterEach(() => {
    // @ts-ignore
    logger.info.mockClear();
    // @ts-ignore
    logger.error.mockClear();
    // @ts-ignore
    logger.fatal.mockClear();
    // @ts-ignore
    logger.start.mockClear();
  });

  it('should report missing deps', async () => {
    const res = await depscheck(getConfigWithCollector(['missingDeps'], ['missingDeps']));
    expect(res).toBeFalsy();
    expect(checkMessage('Missing dependencies')).toBeTruthy();
  });

  it('should report unused deps', async () => {
    const res = await depscheck(getConfigWithCollector(['unusedDeps'], ['unusedDeps']));
    expect(res).toBeFalsy();
    expect(checkMessage('Unused dependencies')).toBeTruthy();
  });

  it('should report mismatch deps', async () => {
    const res = await depscheck(
      getConfigWithCollector(['mismatchDeps/pkgA', 'mismatchDeps/pkgB'], ['mismatchDeps/pkgA'])
    );
    expect(res).toBeFalsy();
    expect(checkMessage('Mismatched dependencies')).toBeTruthy();
  });

  it('should report mismatch but satisfies deps', async () => {
    const res = await depscheck(
      getConfigWithCollector(
        ['mismatchButSatisfieDeps/pkgA', 'mismatchButSatisfieDeps/pkgB'],
        ['mismatchButSatisfieDeps/pkgA']
      )
    );
    expect(res).toBeFalsy();
    expect(checkMessage('Mismatched dependencies')).toBeTruthy();
  });

  it('should pass if only used deps', async () => {
    const res = await depscheck(
      getConfigWithCollector(['matchDeps/pkgA', 'matchDeps/pkgB'], ['matchDeps/pkgA'])
    );
    expect(res).toBeTruthy();
  });

  it('should pass if tramvai deps range', async () => {
    const res = await depscheck(
      getConfigWithCollector(
        ['tramvaiMatchDeps/pkgA', 'tramvaiMatchDeps/pkgB'],
        ['tramvaiMatchDeps/pkgA']
      )
    );
    expect(res).toBeTruthy();
  });

  it('should respect ignore-patterns', async () => {
    const res = await depscheck({
      ...getConfigWithCollector(
        ['ignorePatterns/pkgA', 'ignorePatterns/pkgB'],
        ['ignorePatterns/pkgB', 'ignorePatterns/pkgA']
      ),
      ignorePatterns: ['**/pkgA/**/*'],
      fix: false,
    });
    expect(res).toBeTruthy();
  });

  // TODO: unskip if [issue](https://github.com/depcheck/depcheck/issues/712) is resolved
  it.skip('should parse css imports', async () => {
    const res = await depscheck(getConfigWithCollector(['cssModules'], ['cssModules']));
    expect(res).toBeTruthy();
  });

  it('should handle peerDependencies of direct deps', async () => {
    const res = await depscheck(getConfigWithCollector(['peerDeps'], ['peerDeps']));
    expect(res).toBeTruthy();
  });

  it('should handle hoisted peerDependencies of direct deps', async () => {
    const res = await depscheck(
      getConfigWithCollector(['hoistedPeerDeps/pkgNestedS'], ['hoistedPeerDeps/pkgNestedS'])
    );
    expect(res).toBeTruthy();
  });

  it('should handle transitive peerDependencies of direct deps', async () => {
    const res = await depscheck(
      getConfigWithCollector(['transitivePeerDeps'], ['transitivePeerDeps'])
    );
    expect(res).toBeTruthy();
  });

  it('should report missing peerDependencies of direct deps', async () => {
    const res = await depscheck(getConfigWithCollector(['missingPeerDeps'], ['missingPeerDeps']));
    expect(res).toBeFalsy();
  });

  it('should report mismatched peerDependencies of direct deps', async () => {
    const res = await depscheck(
      getConfigWithCollector(['mismatchedPeerDeps'], ['mismatchedPeerDeps'])
    );
    expect(res).toBeFalsy();
  });

  it('should respect ignorePeerDependencies', async () => {
    const res = await depscheck({
      ...getConfigWithCollector(['missingPeerDeps'], ['missingPeerDeps']),
      ignorePeerDependencies: ['pkg-gg*'],
      fix: false,
    });
    expect(res).toBeTruthy();
  });

  it('should pass with stub deps', async () => {
    const res = await depscheck(getConfigWithCollector(['stubVersions'], ['stubVersions']));
    expect(res).toBeTruthy();
  });

  it('should respect ignoreUnused', async () => {
    const res = await depscheck({
      ...getConfigWithCollector(['unusedDepsAndDevDeps'], ['unusedDepsAndDevDeps']),
      ignoreUnused: ['pkg-*'],
    });
    expect(res).toBeTruthy();
  });

  describe('autofix', () => {
    it('should remove unused deps and devDeps', async () => {
      const res = await depscheck({
        ...getConfigWithCollector(['unusedDepsAndDevDeps'], ['unusedDepsAndDevDeps']),
        fix: true,
      });
      expect(res).toBeTruthy();
    });
  });
});
