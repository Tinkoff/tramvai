import type { EnvironmentManager as Interface } from '@tramvai/tokens-common';

export class EnvironmentManager implements Interface {
  protected parameters: Record<string, string>;

  constructor() {
    this.parameters = {};
  }

  get(name: string): string | undefined {
    return this.parameters[name];
  }

  getInt(name: string, def: number): number {
    const value = Number(name in this.parameters ? this.parameters[name] : def);
    return Number.isFinite(value) ? value : def;
  }

  getAll() {
    return this.parameters;
  }

  update(result: Record<string, string>) {
    this.parameters = Object.assign(this.parameters, result);
  }

  clientUsed() {
    return this.getAll();
  }

  updateClientUsed(result: Record<string, string>) {
    this.update(result);
  }
}
