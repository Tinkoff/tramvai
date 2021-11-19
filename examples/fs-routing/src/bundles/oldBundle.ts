import { createBundle } from '@tramvai/core';
import { lazy } from '@tramvai/react';
import { MainModal } from '../components/features/Modal/main';

export default createBundle({
  name: 'oldBundle',
  components: {
    'oldBundle/OldPage': lazy(() => import('../components/OldPage')),
    modal: MainModal,
  },
});
