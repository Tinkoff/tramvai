import type { ChildApp } from '@tramvai/child-app-core';
import type { ChildAppFinalConfig, ChildAppLoader } from '@tramvai/tokens-child-app';
import type { ChildAppModuleWrapper } from './types/module';

export abstract class Loader implements ChildAppLoader {
  abstract get(config: ChildAppFinalConfig): ChildApp | void;

  abstract load(config: ChildAppFinalConfig): Promise<ChildApp | void>;

  abstract init(config: ChildAppFinalConfig): Promise<void>;

  protected resolve(entry: ChildAppModuleWrapper) {
    return entry.default;
  }
}
