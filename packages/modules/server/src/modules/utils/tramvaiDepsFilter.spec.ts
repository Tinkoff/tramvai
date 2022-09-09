import { tramvaiDepsFilter } from './tramvaiDepsFilter';

describe('server/utils/tramvaiDepsFilter', () => {
  it('should leave only @tramvai dependencies', () => {
    expect(
      tramvaiDepsFilter({
        '@tramvai/module-foo': '^0.14.2',
        '@tramvai/module-bar': '^0.3.3',
        '@tinkoff/lib-foo': '^0.2.8',
        '@tinkoff/lib-bar': '^0.6.3',
        '@tramvai/papi': '^0.5.1',
        '@tramvai/state': '^0.10.3',
        '@tramvai/tokens-route': '^0.28.0',
        '@tramvai-another-scope/module-foo': '^0.2.1',
        '@tramvai-another-scope/module-bar': '^0.1.2',
        'hoist-non-react-statics': '^3.2.1',
        '@commitlint/cli': '^8.3.5',
        '@commitlint/config-conventional': '^8.3.4',
        '@scope/foo': '^0.38.8',
        '@scope/bar': '^0.38.8',
        '@scope/baz-one-two': '^0.38.8',
        '@slack/web-api': '^5.6.0',
        '@testing-library/jest-dom': '^5.1.1',
        '@testing-library/react': '^10.0.1',
        '@types/hoist-non-react-statics': '^3.3.1',
        '@types/jest': '^25.1.4',
        '@types/lru-cache': '^5.1.0',
        '@types/node': '^13.13.2',
        '@types/react': '^16.9.23',
        '@types/react-dom': '^16.9.5',
        '@types/webpack-env': '^1.13.16',
        '@types/yandex-maps': '^2.1.9',
        'conventional-changelog-angular': '^5.0.6',
        'cross-env': '^7.0.2',
        'cz-conventional-changelog': '^3.1.0',
        'lint-staged': '^10.1.0',
        'node-mocks-http': '^1.8.1',
        'recursive-readdir': '^2.2.2',
      })
    ).toMatchInlineSnapshot(`
      Object {
        "@tramvai-another-scope/module-bar": "^0.1.2",
        "@tramvai-another-scope/module-foo": "^0.2.1",
        "@tramvai/module-bar": "^0.3.3",
        "@tramvai/module-foo": "^0.14.2",
        "@tramvai/papi": "^0.5.1",
        "@tramvai/state": "^0.10.3",
        "@tramvai/tokens-route": "^0.28.0",
      }
    `);
  });
});
