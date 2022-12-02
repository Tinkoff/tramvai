import type { MultiCompiler } from 'webpack';

export const resolveDone = (compiler: MultiCompiler) => {
  return new Promise<void>((resolve, reject) => {
    compiler.hooks.done.tap('resolveDone', (stats) => {
      if (stats.hasErrors()) {
        const [error] = stats.toJson({ all: false, errors: true, errorDetails: true }).errors;

        reject(Object.assign(new Error(error.message), error));

        return;
      }

      resolve();
    });
  });
};
