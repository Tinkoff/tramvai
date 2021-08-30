import type { PluginObj, template, types } from '@babel/core';

export interface Babel {
  types: typeof types;
  template: typeof template;
}

export type Plugin<PluginOptions = void> = (babel: Babel) => PluginObj<PluginOptions>;
