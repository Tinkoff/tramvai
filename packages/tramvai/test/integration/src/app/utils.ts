import type { AddressInfo } from 'net';
import type { CliResult } from './types';

export const getServerUrl = ({ server }: CliResult) => {
  const { port } = server?.address() as AddressInfo;

  return `http://localhost:${port}`;
};

export const getStaticUrl = ({ staticServer }: CliResult) => {
  const { port } = staticServer?.address() as AddressInfo;

  return `http://localhost:${port}`;
};
