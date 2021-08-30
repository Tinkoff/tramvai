import { createPapiMethod, getPapiParameters, PAPI_PARAMETERS } from './createPapiMethod';

describe('papi/createPapiMethod', () => {
  it('should return object with papi parameters', () => {
    const handler = async () => {};
    const papi = createPapiMethod({
      path: '/test',
      handler,
    });

    expect(papi).toBe(handler);
    expect(papi[PAPI_PARAMETERS]).toBeDefined();
  });

  it('should return params for created papi', () => {
    const handler = async () => {};
    const papi = createPapiMethod({
      path: '/test',
      handler,
    });

    expect(getPapiParameters(papi)).toEqual({
      handler,
      path: '/test',
      method: 'all',
      options: {},
    });
  });
});
