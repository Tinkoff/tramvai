import type { PackageManagerOptions } from './PackageManager';
import { PackageManager } from './PackageManager';

export class UnknownPackageManager extends PackageManager {
  readonly name: 'unknown';

  constructor(options: PackageManagerOptions) {
    super(options);
  }

  async install() {
    return this.throwUnknownError();
  }

  async remove() {
    return this.throwUnknownError();
  }

  async dedupe() {
    return this.throwUnknownError();
  }

  async exists() {
    return this.throwUnknownError();
  }

  getLockFileName() {
    return this.throwUnknownError();
  }

  private throwUnknownError(): never {
    throw new Error(
      'The package manager used on the project is not supported, or the lock-file was not found'
    );
  }
}
