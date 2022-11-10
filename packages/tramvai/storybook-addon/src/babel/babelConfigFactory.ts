import { babelConfigFactory as tramvaiBabelConfigFactory } from '@tramvai/cli';

type Env = 'development' | 'production';

export const babelConfigFactory = ({ typescript = true }: { typescript?: boolean } = {}) =>
  tramvaiBabelConfigFactory({
    typescript,
    env: process.env.NODE_ENV as Env,
    generateDataQaTag: false,
    removeTypeofWindow: true,
    modern: true,
  });
