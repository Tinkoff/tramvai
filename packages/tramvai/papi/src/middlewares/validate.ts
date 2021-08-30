import Ajv from 'ajv';
import type { RequestHandler } from 'express';
import type { MiddlewareCreator } from '../types';

export interface Options {
  validator?: Ajv.Ajv;
}

declare module '../types' {
  export interface Options {
    schema?: {
      params?: {};
      query?: {};
      body?: {};
    };
  }
}

const KEYS = ['params', 'query', 'body'] as const;

export const validate = (options?: Options): MiddlewareCreator => {
  const validator = options?.validator ?? new Ajv({ coerceTypes: true });

  return (papi): RequestHandler | null => {
    const { schema } = papi.options;

    if (!schema || !KEYS.some((key) => schema[key])) {
      return null;
    }

    return async (req, res, next) => {
      for (const key of KEYS) {
        const compiledValidator: Ajv.ValidateFunction = schema[key]
          ? validator.compile(schema[key] as Record<string, any>)
          : () => true;
        const data = req[key];

        // console.log(data, schema[key], validate, validate(data));
        if (!compiledValidator(data)) {
          // console.log('validation failed');
          // TODO: Should be replaced with general application-wide error factory
          const err = new Error(`invalid ${key}`) as any;
          err.status = 400;
          err.expose = true;
          err.errors = compiledValidator.errors;
          return next(err);
        }
      }

      next();
    };
  };
};
