import { createPapiMethod } from '@tramvai/papi';
import { PAPI_CACHE_TOKEN } from '../tokens';

// in tramvai.json we've added option to setup file-based papi
//   {
//      "serverApiDir": "server-add-file-api/papi"
//   }
//
// And thanks to that option any file in that directory will become papi handler for url based on filename
// /${appName}/papi/${fileName} i.e. for current file it'll be /server/papi/getSum

// eslint-disable-next-line import/no-default-export
export default createPapiMethod({
  // handler function will be called for any request to url that handled by this papi
  async handler({ body, requestManager }) {
    const { cache } = this.deps;
    const method = requestManager.getMethod();
    const { a, b } = body;

    if (method !== 'POST') {
      throw new Error('only post methods');
    }

    if (!a || !b) {
      return {
        error: true,
        message: 'body parameters a and b should be set',
      };
    }

    const key = `${a},${b}`;

    if (cache.has(key)) {
      return { error: false, fromCache: true, result: cache.get(key) };
    }

    const result = +a + +b;

    cache.set(key, result);

    return { error: false, fromCache: false, result };
  },
  deps: {
    // Singleton tokens that should outlive function handler scope should be defined in the app itself
    cache: PAPI_CACHE_TOKEN,
  },
});
