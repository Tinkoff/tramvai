import type { Compiler, MultiCompiler } from 'webpack';

export const closeWebpack = (compiler: Compiler | MultiCompiler) => {
  return new Promise<void>((resolve, reject) => {
    compiler.close((error) => {
      if (error) {
        return reject(error);
      }

      resolve();
    });
  });
};
