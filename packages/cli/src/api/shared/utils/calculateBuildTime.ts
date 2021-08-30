import type { Compiler } from 'webpack';

export const calculateBuildTime = (compiler: Compiler) => {
  let startTime = Date.now();
  let timeDiff: number;

  compiler.hooks.invalid.tap('calculateBuildTime', () => {
    startTime = Date.now();
  });
  compiler.hooks.done.tap('calculateBuildTime', (stats) => {
    timeDiff = Date.now() - startTime;
  });

  return () => {
    return timeDiff;
  };
};
