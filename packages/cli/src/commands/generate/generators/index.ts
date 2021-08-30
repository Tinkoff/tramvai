import type { PlopGeneratorConfig } from 'node-plop';
import action from './action';
import bundle from './bundle';
import reducer from './reducer';
import page from './page';
import component from './component';
import module from './module';
import type { GeneratorName } from '../command';
import type { GeneratorFactory } from './typings';

const generators: Record<GeneratorName, PlopGeneratorConfig | GeneratorFactory> = {
  action,
  bundle,
  reducer,
  page,
  component,
  module,
};

export default generators;
