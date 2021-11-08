import type { AddressInfo } from 'net';
import type { PromiseType } from 'utility-types';
import type { start } from '@tramvai/cli';

type CliResult = PromiseType<ReturnType<typeof start>>;

export const getServerUrl = ({ server }: CliResult) => {
  const { port } = server?.address() as AddressInfo;

  return `http://localhost:${port}`;
};

export const getStaticUrl = ({ staticServer }: CliResult) => {
  const { port } = staticServer?.address() as AddressInfo;

  return `http://localhost:${port}`;
};
