/**
 * Fork of https://github.com/fastify/fastify-express
 */

import fp from 'fastify-plugin';
// eslint-disable-next-line no-restricted-imports
import symbols from 'fastify/lib/symbols';
import express from 'express';
import type { FastifyPluginCallback } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    /**
     * Express middleware function
     */
    use: express.Application['use'];

    /**
     * Express application instance
     */
    express: express.Application;
  }
}

interface Options {
  express: {
    instance: express.Application;
  };
}

const kMiddlewares = Symbol('fastify-express-middlewares');

const expressPlugin: FastifyPluginCallback<Options> = (fastify, options, next) => {
  fastify.decorate('use', use);
  // eslint-disable-next-line no-param-reassign
  fastify[kMiddlewares] = [];
  fastify.decorate('express', options.express?.instance ?? express());
  fastify.express.disable('x-powered-by');

  fastify
    .addHook('preHandler', enhanceRequest)
    .addHook('preHandler', runConnect)
    .addHook('onRegister', onRegister);

  function use(path, fn) {
    if (typeof path === 'string') {
      const prefix = this[symbols.kRoutePrefix];
      // eslint-disable-next-line no-param-reassign
      path = prefix + (path === '/' && prefix.length > 0 ? '' : path);
    }
    this[kMiddlewares].push([path, fn]);
    if (fn == null) {
      this.express.use(path);
    } else {
      this.express.use(path, fn);
    }
    return this;
  }

  function enhanceRequest(req, reply, next) {
    req.raw.originalUrl = req.raw.url;
    req.raw.id = req.id;
    req.raw.hostname = req.hostname;
    req.raw.ip = req.ip;
    req.raw.ips = req.ips;
    req.raw.log = req.log;
    // eslint-disable-next-line no-param-reassign
    reply.raw.log = req.log;

    if (req.body) {
      req.raw.body = req.body;
    }
    if (req.cookies) {
      req.raw.cookies = req.cookies;
    }

    const originalProtocol = req.raw.protocol;
    // Make it lazy as it does a bit of work
    Object.defineProperty(req.raw, 'protocol', {
      get() {
        // added in Fastify@3.5, so handle it missing
        return req.protocol || originalProtocol;
      },
    });

    next();
  }

  function runConnect(req, reply, next) {
    if (this[kMiddlewares].length > 0) {
      for (const [headerName, headerValue] of Object.entries(reply.getHeaders())) {
        reply.raw.setHeader(headerName, headerValue);
      }

      this.express(req.raw, reply.raw, next);
    } else {
      next();
    }
  }

  function onRegister(instance) {
    const middlewares = instance[kMiddlewares].slice();
    // eslint-disable-next-line no-param-reassign
    instance[kMiddlewares] = [];
    instance.decorate('express', express());
    instance.express.disable('x-powered-by');
    instance.decorate('use', use);
    for (const middleware of middlewares) {
      instance.use(...middleware);
    }
  }

  next();
};

export const fastifyExpressCompatibility = fp(expressPlugin, {
  fastify: '>=3.0.0',
  name: 'fastify-express',
});
