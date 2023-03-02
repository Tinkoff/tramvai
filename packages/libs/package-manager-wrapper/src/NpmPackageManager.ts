import type {
  InstallOptions,
  PackageManagerOptions,
  RemoveOptions,
  DedupeOptions,
} from './PackageManager';
import { PackageManager } from './PackageManager';

export class NpmPackageManager extends PackageManager {
  readonly name = 'npm';

  constructor(options: PackageManagerOptions) {
    super(options);
  }

  async install(options: InstallOptions = {}) {
    const { name, version, noSave, devDependency } = options;

    const commandLineArgs = [
      'npm',
      'install',
      name && (version ? `${name}@${version}` : name),
      version && '--save-exact',
      '--legacy-peer-deps',
      noSave && '--no-save',
      devDependency && '--save-dev',
      // use already existing package version if it satisfies semver,
      // instead of adding latest version during install
      '--prefer-dedupe',
      this.registryFlag(options),
    ].filter(Boolean);

    await this.run(commandLineArgs.join(' '), options);
  }

  async remove(options: RemoveOptions) {
    const { name } = options;

    const commandLineArgs = ['npm', 'uninstall', name, this.registryFlag(options)].filter(Boolean);

    await this.run(commandLineArgs.join(' '), options);
  }

  async dedupe(options: DedupeOptions = {}) {
    await this.run('npm dedupe --legacy-peer-deps', options);
  }

  getLockFileName() {
    return 'package-lock.json';
  }
}
