import { promisify } from 'util';
import fs from 'fs';
import postcss from 'postcss';
// @ts-ignore
import postcssTildaPlugin from 'postcss-modules-tilda';
// @ts-ignore
import requirePackageName from 'require-package-name';

const MODULE_PATH_RE = /['"]~(.+?)['"]$/;

function getModulePathExtractor(modulePaths: string[]) {
  return (importSubstr: string) => {
    const match = MODULE_PATH_RE.exec(importSubstr);
    if (match) {
      modulePaths.push(match[1]);
    }
  };
}

export async function parseCssModule(filename: string, deps: string[], rootDir: string) {
  const css = await promisify(fs.readFile)(filename, { encoding: 'utf-8' });
  const processor = postcss([postcssTildaPlugin]);
  const { root } = await processor.process(css, { from: filename });

  if (!root) {
    return [];
  }

  const modulePaths: string[] = [];
  const modulePathExtractor = getModulePathExtractor(modulePaths);

  root.walkAtRules(/^value|import$/, (rule) => {
    modulePathExtractor(rule.params);
  });

  root.walkDecls(/^composes$/, (rule) => {
    modulePathExtractor(rule.value);
  });

  return modulePaths.map(requirePackageName);
}
