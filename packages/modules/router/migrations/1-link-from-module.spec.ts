import { createApi } from '@tramvai/tools-migrate/lib/testUtils';

import migration from './1-link-from-module';

describe('migrations/packages/modules/router/1-link-from-module', () => {
  const api = createApi({
    packageJSON: { source: {}, path: '/package.json' },
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
      'no changes, has any imports from packages': {
        input: {
          source: `
import { Router } from '@tinkoff/router';
import { RouterModule } from '@tramvai/module-render';

const modules = [RouterModule];

const router = new Router();
`,
        },
        output: { source: undefined },
      },
      'no changes, has correct Link import': {
        input: {
          source: `
import { Link } from '@tramvai/module-render';

const Component = () => {
  return <Link url="/">link</Link>;
};
`,
        },
        output: { source: undefined },
      },
      'replace incorrect Link import': {
        input: {
          source: `
import { Link } from '@tinkoff/router';

const Component = () => {
  return <Link url="/">link</Link>;
};
`,
        },
        output: {
          source: `
import { Link } from '@tramvai/module-router';

const Component = () => {
  return <Link url="/">link</Link>;
};
`,
        },
      },
      'replace incorrect Link import, other imports without changes': {
        input: {
          source: `
import { Router, Link } from '@tinkoff/router';
import { RouterModule } from '@tramvai/module-router';

const modules = [RouterModule];

const router = new Router();

const Component = () => {
  return <Link url="/">link</Link>;
};
`,
        },
        output: {
          source: `
import { Router } from '@tinkoff/router';
import { RouterModule, Link } from '@tramvai/module-router';

const modules = [RouterModule];

const router = new Router();

const Component = () => {
  return <Link url="/">link</Link>;
};
`,
        },
      },
      'replace incorrect Link import, preserve alias': {
        input: {
          source: `
import { Link as RouterLink } from '@tinkoff/router';

const Component = () => {
  return <RouterLink url="/">link</RouterLink>;
};
`,
        },
        output: {
          source: `
import { Link as RouterLink } from '@tramvai/module-router';

const Component = () => {
  return <RouterLink url="/">link</RouterLink>;
};
`,
        },
      },
    },
  });

  beforeAll(async () => {
    await migration(api);
  });
});
