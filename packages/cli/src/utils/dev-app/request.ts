import propOr from '@tinkoff/utils/object/propOr';
import createRequest from '@tinkoff/request-core';
import http from '@tinkoff/request-plugin-protocol-http';
import type { ConfigManager } from '../../config/configManager';

const request = createRequest([http()]);

export const appRequest = <T>(configManager: ConfigManager, path: string) => {
  const { host, port } = configManager;
  const serverPath = `http://${host}:${port}`;

  return request<T>({ url: `${serverPath}${path}` });
};

interface BundleInfoResponse {
  resultCode: string;
  payload: string[];
}

export const appBundleInfo = async (configManager: ConfigManager) => {
  const { name } = configManager;

  const response = await appRequest<BundleInfoResponse>(configManager, `/${name}/papi/bundleInfo`);

  return propOr('payload', [], response);
};
