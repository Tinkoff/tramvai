import supertest from 'supertest';

interface Options {
  serverUrl: string;
  appName: string;
}

export const wrapPapi = ({ serverUrl, appName }: Options) => {
  const publicPapi = supertest(`${serverUrl}/${appName}/papi/`);
  const privatePapi = supertest(`${serverUrl}/${appName}/private/papi/`);

  return {
    publicPapi,
    privatePapi,
    clearCache: () => {
      return privatePapi.post(`clear-cache`).expect(404).expect('X-Status', 'done');
    },
    bundleInfo: () => {
      return publicPapi.get('bundleInfo').expect(200);
    },
  };
};
