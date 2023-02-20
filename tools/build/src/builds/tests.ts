import { resolve } from 'path';
import { ScriptTarget } from 'typescript';
import { existsSync } from 'fs';
import type { Build } from './build.h';
import { createInputOptions, createOutputOptions } from './common';
import { mergeFiles } from '../packageJson';

export const testsBuild: Build = {
  name: 'test',
  shouldExecute: async ({ cwd }) => {
    return existsSync(resolve(cwd, 'tests.ts'));
  },
  async getOptions(params) {
    const input = createInputOptions(params, {
      entry: './tests.ts',
      target: ScriptTarget.ES2019,
      newTsPlugin: true,
      typescriptConfig: {
        // сбрасываем указание declarationDir чтобы d.ts файл оказался в корне пакета
        declarationDir: undefined,
      },
    });
    const output = createOutputOptions(
      {
        ...params,
        options: {
          ...params.options,
          preserveModules: false,
        },
      },
      {
        file: 'tests.js',
        format: 'cjs',
        exportsField: 'named',
        postfix: '.js',
      }
    );

    return {
      input,
      output: {
        ...output,
        dir: '.',
      },
    };
  },
  async modifyPackageJSON({ packageJSON }) {
    return {
      ...packageJSON,
      files: mergeFiles(packageJSON, ['tests.js', 'tests.d.ts']),
    };
  },
};
