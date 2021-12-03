import { body } from './body';

jest.mock('body-parser', () => {
  return {
    urlencoded(options) {
      return `urlencoded ${options.limit}`;
    },
    json(options) {
      return `json ${options.limit}`;
    },
    text(options) {
      return `text ${options.limit}`;
    },
  };
});

describe('body', () => {
  it('skip body parsing', () => {
    const create = body() as any;
    const middleware = create({ options: { disableBodyCookie: true } });

    expect(middleware).toEqual(null);
  });

  it('parse body with all defaults', () => {
    const create = body() as any;
    const middleware = create({ options: {} });

    expect(middleware).toEqual(['text 2mb', 'urlencoded 2mb', 'json 2mb']);
  });

  it('parse body with custom options', () => {
    const create = body({
      limit: '1mb',
    }) as any;
    const middleware = create({ options: {} });

    expect(middleware).toEqual(['text 1mb', 'urlencoded 1mb', 'json 1mb']);
  });
});
