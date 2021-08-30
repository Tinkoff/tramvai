import Ajv from 'ajv';
import { validate } from './validate';

describe('validate', () => {
  function sampleSchema(key, type) {
    return {
      type: 'object',
      properties: {
        [key]: {
          type,
        },
      },
      required: [key],
    };
  }

  it('skips validation with no schemas in route', () => {
    const create = validate() as any;
    const middleware = create({ options: {} });

    expect(middleware).toEqual(null);
  });

  it('works', async () => {
    const create = validate() as any;
    const middleware = create({
      options: {
        schema: {
          params: sampleSchema('foo', 'string'),
          query: sampleSchema('mean', 'number'),
        },
      },
    });

    const req = {
      params: {
        foo: 'bar',
      },
      query: {
        mean: 42,
      },
    };
    const res = {};
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('passes an error when validation is failed', async () => {
    const create = validate() as any;
    const middleware = create({
      options: {
        schema: {
          params: sampleSchema('foo', 'number'),
        },
      },
    });

    const req = {
      params: {
        foo: 'fail',
      },
    };
    const res = {};
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('invalid params'));
  });

  it('can use custom validator', async () => {
    const ajv = new Ajv({
      coerceTypes: true,
      formats: {
        bar: /^bar$/,
      },
    });
    const create = validate({
      validator: ajv,
    }) as any;
    const middleware = create({
      options: {
        schema: {
          params: {
            type: 'object',
            properties: {
              foo: {
                type: 'string',
                format: 'bar',
              },
            },
            required: ['foo'],
          },
        },
      },
    });

    const req = {
      params: {
        foo: 'not a bar',
      },
    };
    const res = {};
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(new Error('invalid params'));
  });
});
