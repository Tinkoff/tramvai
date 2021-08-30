export class EnvironmentManager {
  protected parameters: Record<string, string>;

  constructor() {
    this.parameters = {};
  }

  get(name) {
    return this.parameters[name];
  }

  getInt(name: string, def: number): number {
    const value = Number(name in this.parameters ? this.parameters[name] : def);
    return Number.isFinite(value) ? value : def;
  }

  getAll() {
    return this.parameters;
  }

  update(result) {
    this.parameters = Object.assign(this.parameters, result);
  }

  clientUsed() {
    return this.getAll();
  }

  updateClientUsed(result) {
    this.update(result);
  }
}
