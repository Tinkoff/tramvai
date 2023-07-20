export const createCacheKey = (key: string) =>
  [process.env.APP_ID, process.env.APP_VERSION, key].filter(Boolean).join('-');
