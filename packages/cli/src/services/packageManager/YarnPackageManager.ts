import type {
  InstallOptions,
  PackageManagerOptions,
  RemoveOptions,
  DedupeOptions,
} from './PackageManager';
import { PackageManager } from './PackageManager';

export class YarnPackageManager extends PackageManager {
  readonly name: 'yarn';

  constructor(options: PackageManagerOptions) {
    super(options);
  }

  async install(options: InstallOptions = {}) {
    const { name, version, noSave } = options;

    const commandLineArgs = [
      'yarn',
      name && 'add',
      name && (version ? `${name}@${version}` : name),
      noSave && '--frozen-lockfile',
      this.registryFlag(options),
    ].filter(Boolean);

    await this.run(commandLineArgs.join(' '), options);
  }

  async remove(options: RemoveOptions) {
    const { name, registry, cwd } = options;

    const commandLineArgs = ['yarn', 'remove', name, this.registryFlag(options)].filter(Boolean);

    await this.run(commandLineArgs.join(' '), options);
  }

  async dedupe(options: DedupeOptions = {}) {
    const { cwd } = options;
    const packageExists = await this.exists({ name: 'yarn-deduplicate', cwd });

    if (!packageExists) {
      await this.install({
        name: 'yarn-deduplicate',
        noSave: true,
        cwd,
      });
    }

    await this.run('yarn yarn-deduplicate', options);

    await this.remove({
      name: 'yarn-deduplicate',
      cwd,
    });
  }
}
