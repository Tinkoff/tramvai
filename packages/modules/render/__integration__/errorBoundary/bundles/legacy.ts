import { createBundle } from '@tramvai/core';
import { ErrorPageComponentClient } from '../components/ErrorPageComponentClient';

export default createBundle({
  name: 'legacy',
  components: {
    pageDefault: ErrorPageComponentClient,
  },
});
