import { requestFactory } from '@tramvai/test-helpers';

interface Options {
  serverUrl: string;
  appName: string;
}

export const wrapPapi = ({ serverUrl, appName }: Options) => {
  const publicPapi = requestFactory(`${serverUrl}/${appName}/papi/`);
  const privatePapi = requestFactory(`${serverUrl}/${appName}/private/papi/`);

  return {
    publicPapi,
    privatePapi,
    clearCache: () => {
      return privatePapi(`clear-cache`, { method: 'post' }).expect(404).expect('X-Status', 'done');
    },
    bundleInfo: () => {
      return publicPapi('bundleInfo').expect(200);
    },
    apiList: () => {
      return publicPapi('apiList').expect(200);
    },
  };
};
