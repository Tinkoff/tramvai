export const close = async (server: { close: (cb: (err?: Error) => void) => void }) => {
  return new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
};
