import type { Server } from 'net';

export const getListeningPort = (server: Server) => {
  const address = server.address();

  if (typeof address === 'string') {
    throw new Error('cannot resolve port');
  }

  return address.port;
};
