import { routeNormalize } from './routeNormalize';

describe('routeNormalize', () => {
  it('should add slash at the end', () => {
    expect(routeNormalize({ name: '1', path: '/path/abc' })).toEqual({
      name: '1',
      path: '/path/abc/',
    });
    expect(routeNormalize({ name: '2', path: '/fwf/ahr/' })).toEqual({
      name: '2',
      path: '/fwf/ahr/',
    });
    expect(routeNormalize({ name: '3', path: '/' })).toEqual({ name: '3', path: '/' });
  });
});
