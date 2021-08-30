import type { MultiCompiler } from 'webpack';

export const resolveDone = (compiler: MultiCompiler) => {
  return new Promise<void>((resolve, reject) => {
    compiler.hooks.done.tap('resolveDone', (stats) => {
      if (stats.hasErrors()) {
        reject(new Error(stats.toJson().errors.join('\n')));

        return;
      }

      resolve();
    });
  });
};
