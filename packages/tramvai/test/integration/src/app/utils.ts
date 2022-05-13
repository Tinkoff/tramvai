import type { AddressInfo } from 'net';
import type { PromiseType } from 'utility-types';
import type { start } from '@tramvai/cli';
import type { StartCliOptions } from './startCli';

type CliResult = PromiseType<ReturnType<typeof start>>;

export const getServerUrl = ({ server }: CliResult) => {
  const { port } = server?.address() as AddressInfo;

  return `http://localhost:${port}`;
};

export const getStaticUrl = ({ staticServer }: CliResult) => {
  const { port } = staticServer?.address() as AddressInfo;

  return `http://localhost:${port}`;
};

export const getUtilityServerUrl = (env: StartCliOptions['env'], { server }: CliResult) => {
  const { port } = server?.address() as AddressInfo;

  return `http://localhost:${env?.UTILITY_SERVER_PORT || port}`;
};
