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
      headers = {},
    }: {
      method?: 'get' | 'post' | 'put' | 'delete';
      body?: Record<string, any>;
      contentType?: 'json' | 'form';
      headers?: Record<string, string>;
    } = {}
  ) => {
    const instance = request[method](path);

    if (contentType) {
      instance.type(contentType);
    }

    for (const header in headers) {
      instance.set(header, headers[header]);
    }

    if (body) {
      return instance.send(body);
    }

    return instance;
  };
};
