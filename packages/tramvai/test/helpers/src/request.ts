import supertest from 'supertest';
import type { FastifyInstance } from 'fastify';
import type { Application } from 'express';

export const requestFactory = (appOrUrl: Application | FastifyInstance | string) => {
  let server: any = appOrUrl;

  if (typeof appOrUrl === 'object' && 'ready' in appOrUrl) {
    appOrUrl.ready();
    server = appOrUrl.server;
  }

  const request = supertest(server);
  return (path: string, { method = 'get' }: { method?: 'get' | 'post' | 'put' } = {}) => {
    return request[method](path);
  };
};
