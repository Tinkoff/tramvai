import { RuleTester } from 'eslint';
import { rule } from './bundle-chunk-name';

const tests: {
  valid?: Array<string | RuleTester.ValidTestCase>;
  invalid?: RuleTester.InvalidTestCase[];
} = {
  invalid: [
    {
      code: `({
        bundles: {
          bundle: () => import('./bundles/bundle'),
        }
      })`,
      errors: [
        {
          message:
            'dynamic imports for bundles require a leading comment with option webpackChunkName',
        },
      ],
      output: `({
        bundles: {
          bundle: () => import(/* webpackChunkName: "bundle" */ './bundles/bundle'),
        }
      })`,
    },
    {
      code: `({
        bundles: {
          'platform/bundle': () => import(
            // webpackChunkName: "bundle"
            './bundles/bundle'
          ),
        }
      })`,
      errors: [
        {
          message: 'dynamic imports for bundles require a /* */ style comment, not a // comment',
        },
      ],
      output: `({
        bundles: {
          'platform/bundle': () => import(
            /* webpackChunkName: "bundle" */
            './bundles/bundle'
          ),
        }
      })`,
    },
    {
      code: `({
        bundles: {
          'platform/bundle': () => import(/*webpackChunkName: "bundle"*/ './bundles/bundle'),
        }
      })`,
      errors: [
        {
          message: 'dynamic imports require a block comment padded with spaces - /* ... */',
        },
      ],
      output: `({
        bundles: {
          'platform/bundle': () => import(/* webpackChunkName: "bundle" */ './bundles/bundle'),
        }
      })`,
    },
    {
      code: `({
        bundles: {
          'platform/bundle': () => import(/* webpackChunkName: bundle */ './bundles/bundle'),
        }
      })`,
      errors: [
        {
          message: 'dynamic imports require a "webpack" comment with valid syntax',
        },
      ],
    },
    {
      code: `({
        bundles: {
          'platform/bundle': () => import(/* webpackPrefetch: true */ './bundles/bundle'),
        }
      })`,
      errors: [
        {
          message:
            'dynamic imports for bundles require a leading comment with option webpackChunkName: "bundle"',
        },
      ],
      output: `({
        bundles: {
          'platform/bundle': () => import(/* webpackPrefetch: true, webpackChunkName: "bundle" */ './bundles/bundle'),
        }
      })`,
    },
    {
      code: `({
        bundles: {
          'platform/bundle': () => import(/* webpackChunkName: 'test', webpackPrefetch: true */ './bundles/bundle'),
        }
      })`,
      errors: [
        {
          message:
            'dynamic imports for bundles require a leading comment with option webpackChunkName: "bundle"',
        },
      ],
      output: `({
        bundles: {
          'platform/bundle': () => import(/* webpackChunkName: "bundle", webpackPrefetch: true */ './bundles/bundle'),
        }
      })`,
    },
    {
      code: `({
        bundles: {
          'platform/app/test-bundle-1': () => import('./bundles/bundle'),
        }
      })`,
      errors: [
        {
          message:
            'dynamic imports for bundles require a leading comment with option webpackChunkName',
        },
      ],
      output: `({
        bundles: {
          'platform/app/test-bundle-1': () => import(/* webpackChunkName: "test-bundle-1" */ './bundles/bundle'),
        }
      })`,
    },
    {
      code: `({
        cases: {
          'platform/case': () => import('./bundles/bundle'),
        },
        tests: {
          'platform/test': () => import('./bundles/bundle'),
        },
        bundles: {
          'platform/bundle': () => import(/* webpackChunkName: "test" */ './bundles/bundle'),
        }
      })`,
      options: [
        {
          propertyNames: ['cases', 'bundles'],
        },
      ],
      errors: [
        {
          message:
            'dynamic imports for bundles require a leading comment with option webpackChunkName',
        },
        {
          message:
            'dynamic imports for bundles require a leading comment with option webpackChunkName: "bundle"',
        },
      ],
      output: `({
        cases: {
          'platform/case': () => import(/* webpackChunkName: "case" */ './bundles/bundle'),
        },
        tests: {
          'platform/test': () => import('./bundles/bundle'),
        },
        bundles: {
          'platform/bundle': () => import(/* webpackChunkName: "bundle" */ './bundles/bundle'),
        }
      })`,
    },
  ],
  valid: [
    {
      code: `({
        bundles: {
          bundle: () => import(/* webpackChunkName: "bundle" */ './bundles/bundle'),
        }
      })`,
    },
    {
      code: `({
        cases: {
          'platform/case': () => import('./bundles/bundle'),
        }
      })`,
    },
    {
      code: `({
        cases: {
          'platform/case': () => import(/* webpackChunkName: "case" */ './bundles/bundle'),
        },
        tests: {
          'platform/test': () => import('./bundles/bundle'),
        },
        bundles: {
          'platform/bundle': () => import(/* webpackChunkName: "bundle" */ './bundles/bundle'),
        }
      })`,
      options: [
        {
          propertyNames: ['cases', 'bundles'],
        },
      ],
    },
  ],
};

const jsRuleTester = new RuleTester({
  parser: require.resolve('babel-eslint'),
});

const tsRuleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

jsRuleTester.run('bundle-chunk-name-js', rule, tests);
tsRuleTester.run('bundle-chunk-name-ts', rule, tests);
