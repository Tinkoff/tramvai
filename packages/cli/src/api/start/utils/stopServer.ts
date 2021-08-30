import type { StoppableServer } from 'stoppable';

export const stopServer = async (server: StoppableServer) => {
  return new Promise<void>((resolve, reject) => {
    server.stop((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
