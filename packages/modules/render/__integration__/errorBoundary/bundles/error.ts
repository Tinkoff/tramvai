import { createBundle } from '@tramvai/core';
import { ErrorPageComponentSSR } from '../components/ErrorPageComponentSSR';

export default createBundle({
  name: 'error',
  components: {
    pageDefault: ErrorPageComponentSSR,
  },
});
