import { babelConfigFactory as tramvaiBabelConfigFactory } from '@tramvai/cli';

export const babelConfigFactory = () =>
  tramvaiBabelConfigFactory({
    modules: 'commonjs',
    typescript: true,
    generateDataQaTag: false,
    removeTypeofWindow: true,
  });
