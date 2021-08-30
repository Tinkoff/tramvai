import { safeStringify } from './safeStringify';

export const safeDehydrate = (json: Record<string, any>) => {
  return safeStringify(json).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
};
