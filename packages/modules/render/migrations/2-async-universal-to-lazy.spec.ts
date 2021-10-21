import { createApi } from '@tramvai/tools-migrate/lib/testUtils';

import migration from './2-async-universal-to-lazy';

describe('migrations/packages/modules/render/2-async-universal-to-lazy', () => {
  describe('no-changes', () => {
    const api = createApi({
      packageJSON: {
        source: {
          dependencies: {
            '@tramvai/react': '1.0.0',
          },
        },
        path: '/package.json',
      },
      tramvaiJSON: { source: {}, path: '/tramvai.json' },
      transformTests: {
        'no changes': {
          input: {
            source: `
import { createApp } from '@tramvai/core';
import { RenderModule } from '@tramvai/module-render';

createApp({
  modules: [
    RenderModule,
  ],
  providers: [],
});
`,
          },
          output: { source: undefined },
        },
      },
    });

    beforeAll(async () => {
      await migration(api);
    });

    it('test package.json', () => {
      expect(api.packageJSON.source).toEqual({
        dependencies: {
          '@tramvai/react': '1.0.0',
        },
      });
    });
  });

  describe('transform lazy(import) to lazy(() => import)', () => {
    const api = createApi({
      packageJSON: {
        source: {
          dependencies: {
            '@tramvai/react': '1.0.0',
          },
        },
        path: '/package.json',
      },
      tramvaiJSON: { source: {}, path: '/tramvai.json' },
      transformTests: {
        simple: {
          input: {
            source: `
import { lazy } from '@tramvai/react';

const asyncCmp = lazy(import('./cmp'));
`,
          },
          output: {
            source: `
import { lazy } from '@tramvai/react';

const asyncCmp = lazy(() => import('./cmp'));
`,
          },
        },
        'another name': {
          input: {
            source: `
import { lazy as async } from '@tramvai/react';

const asyncCmp = async(import('./cmp'));
`,
          },
          output: {
            source: `
import { lazy as async } from '@tramvai/react';

const asyncCmp = async(() => import('./cmp'));
`,
          },
        },
      },
    });

    beforeAll(async () => {
      await migration(api);
    });

    it('test package.json', () => {
      expect(api.packageJSON.source).toEqual({
        dependencies: {
          '@tramvai/react': '0.0.0-stub',
        },
      });
    });
  });

  describe('transform @tinkoff/platform-legacy', () => {
    const api = createApi({
      packageJSON: {
        source: {
          dependencies: {
            '@tinkoff/platform-legacy': '^3.0.0',
          },
        },
        path: '/package.json',
      },
      tramvaiJSON: { source: {}, path: '/tramvai.json' },
      transformTests: {
        simple: {
          input: {
            source: `
import asyncUniversal from '@tinkoff/platform-legacy/utils/decorators/asyncUniversal';

const asyncCmp = asyncUniversal(import('./cmp'));
`,
          },
          output: {
            source: `
import { lazy } from '@tramvai/react';

const asyncCmp = lazy(() => import('./cmp'));
`,
          },
        },
        'has import from @tramvai/react': {
          input: {
            source: `
import asyncUniversal from '@tinkoff/platform-legacy/utils/decorators/asyncUniversal';
import { withDi } from '@tramvai/react';

const asyncCmp = asyncUniversal(import('./cmp'));
`,
          },
          output: {
            source: `
import { withDi, lazy } from '@tramvai/react';

const asyncCmp = lazy(() => import('./cmp'));
`,
          },
        },
      },
    });

    beforeAll(async () => {
      await migration(api);
    });

    it('test package.json', () => {
      expect(api.packageJSON.source).toEqual({
        dependencies: {
          '@tinkoff/platform-legacy': '^3.0.0',
          '@tramvai/react': '0.0.0-stub',
        },
      });
    });
  });

  describe('transform universal', () => {
    const api = createApi({
      packageJSON: {
        source: {
          dependencies: {
            'react-universal-component': '^4.4.0',
          },
        },
        path: '/package.json',
      },
      tramvaiJSON: { source: {}, path: '/tramvai.json' },
      transformTests: {
        simple: {
          input: {
            source: `
import universal from 'react-universal-component';

const asyncCmp = universal(import('./cmp'));
`,
          },
          output: {
            source: `
import { lazy } from '@tramvai/react';

const asyncCmp = lazy(() => import('./cmp'));
`,
          },
        },
        'has import from @tramvai/react': {
          input: {
            source: `
import universal from 'react-universal-component';
import { withDi } from '@tramvai/react';

const asyncCmp = universal(import('./cmp'));
`,
          },
          output: {
            source: `
import { withDi, lazy } from '@tramvai/react';

const asyncCmp = lazy(() => import('./cmp'));
`,
          },
        },
        'import without function wrapper': {
          input: {
            source: `
import universal from 'react-universal-component';

export const Cmp = universal(() => import('./Cmp'));
`,
          },
          output: {
            source: `
import { lazy } from '@tramvai/react';

export const Cmp = lazy(() => import('./Cmp'));
`,
          },
        },
        'should add comment and remove old options': {
          input: {
            source: `
import universal from 'react-universal-component';

export const Cmp = universal(() => import('./Cmp'), {
  ignoreBabelRename: true,
  key: 'Name',
});
`,
          },
          output: {
            source: `
import { lazy } from '@tramvai/react';

export const Cmp = lazy(() => import('./Cmp'), {
  /*
    Заменить пожалуйста текущий импортируемый файл, на файл откуда экспортируется асинхронный компонент через default, т.к. @tramvai/react поддерживает только default
  Если заменить в исходном файле нельзя, то можно просто создать файл-обёртку, который реэкспортнет нужный ключ через export default,
  затем уберите эту опцию
  */
  key: 'Name'
});
`,
          },
        },
      },
    });

    beforeAll(async () => {
      await migration(api);
    });

    it('test package.json', () => {
      expect(api.packageJSON.source).toEqual({
        dependencies: {
          '@tramvai/react': '0.0.0-stub',
        },
      });
    });
  });
});
