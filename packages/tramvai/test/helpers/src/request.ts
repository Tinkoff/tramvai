import supertest from 'supertest';
import type { Application } from 'express';

export const requestFactory = (appOrUrl: Application | string) => {
  const request = supertest(appOrUrl);
  return (path: string, { method = 'get' }: { method?: 'get' | 'post' | 'put' } = {}) => {
    return request[method](path);
  };
};
