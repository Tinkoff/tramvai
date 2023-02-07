import type { Server } from 'net';

export const listenServer = async (server: Server, host: string, port: number): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    server.once('error', (error) => {
      reject(error);
    });

    server.listen(port, host, () => {
      resolve();
    });
  });
};
