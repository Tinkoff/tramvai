import type { Server } from 'net';

export const listenServer = (server: Server, host: string, port: number) => {
  return new Promise<void>((resolve, reject) => {
    server.once('error', (error) => {
      reject(error);
    });
    server.listen(port, host, () => {
      resolve();
    });
  });
};
