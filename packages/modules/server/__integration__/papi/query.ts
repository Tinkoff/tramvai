import { createPapiMethod } from '@tramvai/papi';

// eslint-disable-next-line import/no-default-export
export default createPapiMethod({
  handler({ parsedUrl }) {
    return {
      data: parsedUrl.query.test,
    };
  },
});
