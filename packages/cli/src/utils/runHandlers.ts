export const runHandlers = async (handlers: Array<() => Promise<void>> | null) => {
  if (handlers) {
    return Promise.all(handlers.map((handler) => handler()));
  }
};
