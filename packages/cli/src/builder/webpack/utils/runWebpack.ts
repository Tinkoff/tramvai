import type { Compiler, MultiCompiler } from 'webpack';

export const runWebpack = (compiler: Compiler | MultiCompiler) => {
  return new Promise<void>((resolve, reject) => {
    compiler.run((err, stats) => {
      console.warn(
        stats.toString({
          all: false,
          colors: true,
          warnings: true,
          errors: true,
        })
      );

      if (err || stats.hasErrors()) {
        return reject(
          err ||
            new Error(
              stats
                .toJson()
                .errors.map((error: any) => error.message ?? error)
                .join('\n')
            )
        );
      }

      resolve();
    });
  });
};
