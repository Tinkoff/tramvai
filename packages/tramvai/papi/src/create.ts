import flatten from '@tinkoff/utils/array/flatten';
import isFunction from '@tinkoff/utils/is/function';

import type { RequestHandler } from 'express';
import { Router } from 'express';
import type { Chain, Papi } from './types';
import { getPapiParameters } from './createPapiMethod';

function convert(papis: Papi<any, any>[]) {
  const paths = new Set();
  const result: ReturnType<typeof getPapiParameters>[] = [];

  for (const papi of papis) {
    const papiParams = getPapiParameters(papi);

    if (!papiParams) {
      throw new Error(`papi should be created using createPapiMethod from @tramvai/papi,
      got: ${JSON.stringify(papi)}`);
    }

    const key = `${papiParams.method} ${papiParams.path}`;

    if (paths.has(key)) {
      throw new Error(`papi: route '${key}' already registered`);
    }

    result.push(papiParams);
    paths.add(key);
  }

  return result;
}

export function create(papis: Papi[], chain: Chain): RequestHandler {
  const papiParams = convert(papis);

  const router = Router({
    strict: false,
  });

  router.use((req, res, next) => {
    res.setHeader('cache-control', 'no-cache,no-store,max-age=0,must-revalidate');
    next();
  });

  for (const papi of papiParams) {
    const middlewaresMaybeArray = chain.map((createMiddleware) => createMiddleware(papi));
    const middlewares = flatten(middlewaresMaybeArray).filter(isFunction);

    if (papi.options.trimPapiUrl) {
      const subRouter = Router({
        strict: false,
      });

      subRouter[papi.method]('*', middlewares);

      // express позволяет делать вложенный роутинг https://gist.github.com/zcaceres/f38b208a492e4dcd45f487638eff716c,
      // в этом случае в `request.url` будет находиться не значение `papi.path`, а просто `/`,
      // полный путь при необходимости можно найти в `request.baseUrl`
      router.use(papi.path, subRouter);
    } else {
      router[papi.method](papi.path, middlewares);
    }
  }

  // Handles non existed routes and twice async next() calls where second call done
  // without arguments or with 'route' as first argument
  router.use((req, res) => {
    // Do nothing if respone already has been sent (i.e. timeout error)
    if (res.headersSent) {
      return;
    }

    res.status(404);

    // Just for backward compatibility. Maybe we can remove it.
    res.json({
      resultCode: 'Not found',
      payload: {},
    });
  });

  return router;
}
