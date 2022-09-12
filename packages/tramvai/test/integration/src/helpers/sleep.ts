export const sleep = (ms: number) => {
  return new Promise((resolve) => (setTimeout(resolve, ms) as unknown as NodeJS.Timeout).unref());
};
