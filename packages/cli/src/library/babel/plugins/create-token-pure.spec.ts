import path from 'path';
import pluginTester from 'babel-plugin-tester';
import { createTokenPurePlugin } from './create-token-pure';
import babelConfig from '../index';

pluginTester({
  plugin: createTokenPurePlugin,
  pluginName: 'create-token-pure',
  filename: path.join(__dirname, '__fixtures__', 'create-token-pure', 'test'),
  babelOptions: babelConfig({
    typescript: true,
    generateDataQaTag: false,
    loader: false,
    // @ts-expect-error
    markCreateTokenAsPure: false,
  }),
  tests: {
    'do nothing': {
      fixture: 'do-nothing.ts',
      snapshot: true,
    },
    'add pure annotation when createToken from @tramvai/core': {
      fixture: 'from-core.ts',
      snapshot: true,
    },
    'add pure annotation when createToken from @tinkoff/dippy': {
      fixture: 'from-dippy.ts',
      snapshot: true,
    },
    'do not annotate more again': {
      fixture: 'already-has-comment.ts',
      snapshot: true,
    },
  },
});
