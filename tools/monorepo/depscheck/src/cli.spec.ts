import { execSync, exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

function getFixtureDirPath(fixture) {
  return `${__dirname}/__fixtures__/${fixture}`;
}

function run(args = ''): string {
  return execSync(`node ${path.join(__dirname, '..', 'bin', 'depscheck.js')} ${args}`, {
    encoding: 'utf-8',
  });
}

function runAsync(args = '') {
  return promisify(exec)(`node ${path.join(__dirname, '..', 'bin', 'depscheck.js')} ${args}`, {
    encoding: 'utf-8',
  });
}

describe('depscheck cli', () => {
  jest.setTimeout(30000);

  it('should work by default without config', async () => {
    const fixtureDirPath = getFixtureDirPath('workspacesWithoutConfig');
    process.chdir(fixtureDirPath);
    expect(run()).toMatch(/Processing a[\s\S]*Deps are correct/);
  });

  it("should handle `cliOpts` and `collect` fn's from `collector`", () => {
    const fixtureDirPath = getFixtureDirPath('workspacesWithCollectorConfig');
    process.chdir(fixtureDirPath);
    expect(run('--collectorConfigTest test-value')).toMatch(
      /Received test-value[\s\S]*Deps are correct/
    );
  });

  it('should handle custom config path', () => {
    const fixtureDirPath = getFixtureDirPath('workspacesWithCustomConfig');
    process.chdir(fixtureDirPath);
    expect(run('--config custom-depscheck.config.js --collectorConfigTest test-value')).toMatch(
      /Received test-value[\s\S]*Deps are correct/
    );
  });

  it('should allow disable config load', () => {
    const fixtureDirPath = getFixtureDirPath('workspacesWithCollectorConfig');
    process.chdir(fixtureDirPath);
    expect(() => run('--config false --collectorConfigTest test-value')).toThrow(
      /Unknown argument: collectorConfigTest/
    );
  });

  it('should handle config extensions', () => {
    const fixtureDirPath = getFixtureDirPath('workspacesWithExtendedConfig');
    process.chdir(fixtureDirPath);
    expect(run('--collectorConfigTest test-value')).toMatch(
      /Received test-value[\s\S]*Deps are correct/
    );
  });

  it('should fail process on error', async () => {
    const fixtureDirPath = getFixtureDirPath('missingDeps');
    process.chdir(fixtureDirPath);
    await expect(
      runAsync('--collector @tinkoff-monorepo/pkgs-collector-dir --collectorConfigPkgDirs .')
    ).rejects.toBeDefined();
  });
});
