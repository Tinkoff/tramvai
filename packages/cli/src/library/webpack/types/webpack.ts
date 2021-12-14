import type { container } from 'webpack';

export type ModuleFederationPluginOptions = ConstructorParameters<
  typeof container.ModuleFederationPlugin
>[0];

export type ModuleFederationSharedObject = Record<
  string,
  Exclude<Exclude<ModuleFederationPluginOptions['shared'], any[]>[string], string>
>;
