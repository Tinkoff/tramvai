import { createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';

export default createBundle({
  name: 'oldBundle',
  components: {
    'oldBundle/OldPage': lazy(() => import('../components/OldPage')),
  },
});
