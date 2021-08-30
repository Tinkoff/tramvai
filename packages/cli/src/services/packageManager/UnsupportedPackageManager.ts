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

  private throwUnknownError(): never {
    throw new Error(
      'Используемый на проекте менеджер пакетов не поддерживается, либо lock-файл не найден'
    );
  }
}
