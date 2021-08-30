import { formatAttributes } from './utils';

describe('render/server/utils', () => {
  it('should format attributes', () => {
    const data = [
      {
        target: 'html' as const,
        attrs: {
          string: 'html',
          bool: true,
          object: {},
          num: 1,
        },
      },
    ];

    expect(formatAttributes(data, 'html')).toBe(
      'string="html" bool object="[object Object]" num="1"'
    );
  });
});
