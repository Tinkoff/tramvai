import fs from 'fs';
import path from 'path';
import util from 'util';
import childProcess from 'child_process';
import type { ExecOptions, PromiseWithChild } from 'child_process';

export interface PackageManagerOptions {
  rootDir: string;
  registry?: string;
}

export interface InstallOptions {
  name?: string;
  version?: string;
  registry?: string;
  noSave?: boolean; // works only with npm
  cwd?: string;
  devDependency?: boolean;
}

export interface RemoveOptions {
  name: string;
  registry?: string;
  cwd?: string;
}

export interface ExistsOptions {
  name: string;
  cwd?: string;
}

export interface DedupeOptions {
  cwd?: string;
}

const exec = util.promisify(childProcess.exec);

export abstract class PackageManager {
  readonly name: 'npm' | 'yarn' | 'unknown';

  protected rootDir: string;
  protected registry?: string;

  constructor(options: PackageManagerOptions) {
    const { rootDir, registry } = options;

    this.rootDir = rootDir;
    this.registry = registry;
  }

  abstract install(options?: InstallOptions): Promise<void>;
  abstract remove(options: RemoveOptions): Promise<void>;
  abstract dedupe(options?: DedupeOptions): Promise<void>;
  abstract getLockFileName(): string;

  async exists(options: ExistsOptions): Promise<boolean> {
    const { name, cwd } = options;

    try {
      await fs.promises.access(
        path.join(cwd || this.rootDir, 'node_modules', name, 'package.json')
      );
      return true;
    } catch (e) {
      return false;
    }
  }

  protected run(
    command: string,
    options: ExecOptions
  ): PromiseWithChild<{ stdout: string; stderr: string }> {
    // TODO: maybe replace with execa in order to show output in console with stdio: 'inherit'
    // as it easier to debug problems in that case
    return exec(command, {
      ...options,
      cwd: options.cwd || this.rootDir,
    });
  }

  protected registryFlag(options: { registry?: string }) {
    const registry = options.registry || this.registry;

    return registry && `--registry=${registry}`;
  }
}
