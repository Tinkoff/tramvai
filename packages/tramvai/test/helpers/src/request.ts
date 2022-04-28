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
  return (
    path: string,
    {
      method = 'get',
      body,
      contentType,
    }: {
      method?: 'get' | 'post' | 'put';
      body?: Record<string, any>;
      contentType?: 'json' | 'form';
    } = {}
  ) => {
    const instance = request[method](path);

    if (contentType) {
      instance.type(contentType);
    }

    if (body) {
      return instance.send(body);
    }

    return instance;
  };
};
