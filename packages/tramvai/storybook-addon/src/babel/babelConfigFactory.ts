import { babelConfigFactory as tramvaiBabelConfigFactory } from '@tramvai/cli';

type Env = 'development' | 'production';

export const babelConfigFactory = () =>
  tramvaiBabelConfigFactory({
    env: process.env.NODE_ENV as Env,
    modules: 'commonjs',
    typescript: true,
    generateDataQaTag: false,
    removeTypeofWindow: true,
  });
