import { createBundle } from '@tramvai/core';
import { HttpClientPage } from '../pages/Page';
import { HttpClientPapiPage } from '../pages/PapiPage';

export default createBundle({
  name: 'mainDefault',
  components: {
    pageDefault: HttpClientPage,
    'http-client-papi': HttpClientPapiPage,
  },
});
