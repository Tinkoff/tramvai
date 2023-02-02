import type { container, Configuration } from 'webpack';

export type ModuleFederationPluginOptions = ConstructorParameters<
  typeof container.ModuleFederationPlugin
>[0];

export type ModuleFederationSharedObject = Record<
  string,
  Exclude<Exclude<Required<ModuleFederationPluginOptions>['shared'], any[]>[string], string>
>;

export type SplitChunksOptions = Required<Required<Configuration>['optimization']>['splitChunks'];
