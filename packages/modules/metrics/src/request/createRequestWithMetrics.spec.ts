import { getUrlAndOptions } from './createRequestWithMetrics';

describe('createRequestWithMetrics', () => {
  [
    [['http://example.com/'], ['http://example.com/', {}], 'string url'],
    [[new URL('http://example.com/')], ['http://example.com/', {}], 'object url'],
    [
      ['http://example.com/', { op: 'tions' }],
      ['http://example.com/', { op: 'tions' }],
      'string url and options object',
    ],
    [
      [new URL('http://example.com/'), { op: 'tions' }],
      ['http://example.com/', { op: 'tions' }],
      'object url and options object',
    ],
    [
      [{ op: 'tions', href: 'https://example.com/?utm_source=google' }],
      ['https://example.com/', { op: 'tions', href: 'https://example.com/?utm_source=google' }],
      'options object contained href',
    ],
    [
      [
        {
          op: 'tions',
          protocol: 'https',
          host: 'example.com',
          path: '/path/?utm_source=google',
        },
      ],
      [
        'https://example.com/path/',
        {
          op: 'tions',
          protocol: 'https',
          host: 'example.com',
          path: '/path/?utm_source=google',
        },
      ],
      'options object contained object url',
    ],
  ].forEach(([args, result, title]) => {
    it(`Parse args: ${title}`, () => {
      expect(getUrlAndOptions.call(null, args)).toEqual(result);
    });
  });
});
