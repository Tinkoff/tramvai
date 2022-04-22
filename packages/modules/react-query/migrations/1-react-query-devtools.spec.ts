import { createApi } from '@tramvai/tools-migrate/lib/testUtils';

import migration from './1-react-query-devtools';

describe('migrations/packages/modules/react-query/1-react-query-devtools', () => {
  const api = createApi({
    packageJSON: {
      source: {
        dependencies: {
          '@tramvai/core': '1.1.1',
        },
      },
      path: '/package.json',
    },
    tramvaiJSON: { source: {}, path: '/tramvai.json' },
    transformTests: {
      'do nothing': {
        input: {
          source: `const a = 5;`,
        },
        output: {},
      },
      'import ReactQueryDevtoolsModule from new package': {
        input: {
          source: `import { ReactQueryModule, ReactQueryDevtoolsModule } from '@tramvai/module-react-query';
import { DevToolsModule } from '@tramvai/module-dev-tools';

createApp({
  name: 'app',
  modules: [
    ...modules,
    ReactQueryModule,
    ...(process.env.NODE_ENV === 'development' ? [DevToolsModule, ReactQueryDevtoolsModule] : []),
  ],
  bundles: {},
  providers: [],
});`,
        },
        output: {
          source: `import { ReactQueryDevtoolsModule } from '@tramvai/module-react-query-devtools';
import { ReactQueryModule } from '@tramvai/module-react-query';
import { DevToolsModule } from '@tramvai/module-dev-tools';

createApp({
  name: 'app',
  modules: [
    ...modules,
    ReactQueryModule,
    ...(process.env.NODE_ENV === 'development' ? [DevToolsModule, ReactQueryDevtoolsModule] : []),
  ],
  bundles: {},
  providers: [],
});`,
        },
      },
    },
  });

  beforeAll(async () => {
    await migration(api);
  });

  it('install new devtools module', () => {
    expect(api.packageJSON.source).toEqual({
      dependencies: {
        '@tramvai/core': '1.1.1',
        '@tramvai/module-react-query-devtools': require('../package.json').dependencies[
          '@tramvai/module-react-query-devtools'
        ],
      },
    });
  });
});
