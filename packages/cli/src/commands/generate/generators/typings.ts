import type { PlopGeneratorConfig } from 'node-plop';
import type { ConfigEntry } from '../../../typings/configEntry/common';

export type GeneratorFactoryArgs = {
  configEntry: ConfigEntry;
};

export type GeneratorFactory = (args: GeneratorFactoryArgs) => PlopGeneratorConfig;
