import path from 'path';
import { modernLibsFilter } from '../index';

const getPkgPath = (pkgName: string) =>
  path.resolve(__dirname, 'fixtures', 'filter', 'node_modules', pkgName, 'index.js');

describe('modernLibsFilter', () => {
  it('skip file outside node_modules', () => {
    const filePath = path.resolve(__dirname, 'fixtures', 'filter', 'yet-another-module.js');

    expect(modernLibsFilter(filePath)).toBe(false);
  });

  it('filter library from modern list', () => {
    const pkgPath = getPkgPath('@tramvai/core');

    expect(modernLibsFilter(pkgPath)).toBe(true);
  });

  it('filter library from modern list, scoped', () => {
    const pkgPath = getPkgPath('dippy');

    expect(modernLibsFilter(pkgPath)).toBe(true);
  });

  it('skip standard es5 library', () => {
    const pkgPath = getPkgPath('lib-es5');

    expect(modernLibsFilter(pkgPath)).toBe(false);
  });

  it('filter library with exports field', () => {
    const pkgPath = getPkgPath('lib-with-exports');

    expect(modernLibsFilter(pkgPath)).toBe(true);
  });

  it('skip library with module field', () => {
    const pkgPath = getPkgPath('lib-with-module');

    expect(modernLibsFilter(pkgPath)).toBe(false);
  });

  it('skip library with browser field', () => {
    const pkgPath = getPkgPath('lib-with-browser');

    expect(modernLibsFilter(pkgPath)).toBe(false);
  });

  it('filter library with modern field', () => {
    const pkgPath = getPkgPath('lib-with-modern');

    expect(modernLibsFilter(pkgPath)).toBe(true);
  });

  it('skip library with old node engine', () => {
    const pkgPath = getPkgPath('lib-node-engine-old');

    expect(modernLibsFilter(pkgPath)).toBe(false);
  });

  it('filter library with modern node engine', () => {
    const pkgPath = getPkgPath('lib-node-engine-modern');

    expect(modernLibsFilter(pkgPath)).toBe(true);
  });
});
