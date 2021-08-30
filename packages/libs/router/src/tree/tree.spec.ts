import sizeof from 'object-sizeof';
import { RouteTree } from './tree';

describe('router/tree/tree', () => {
  it('should add route to tree', () => {
    const routes = [
      {
        name: 'root',
        path: '/',
      },
      {
        name: 'test',
        path: '/a/b/c/',
        config: {
          property: 'aaaa',
        },
      },
      {
        name: 'level',
        path: '/level/',
      },
    ];

    const tree = new RouteTree(routes);

    expect(tree.getRoute('/test')).toBeUndefined();
    expect(tree.getRoute('/a/')).toBeUndefined();
    expect(tree.getRoute('/')).toEqual({
      name: 'root',
      path: '/',
      actualPath: '/',
      params: {},
    });
    expect(tree.getRoute('/level')).toEqual({
      name: 'level',
      path: '/level/',
      actualPath: '/level',
      params: {},
    });
  });

  it('test parameterized routes', () => {
    const routes = [
      {
        name: 'params',
        path: '/:abc/test/',
      },
      {
        name: 'test',
        path: '/test/',
      },
      {
        name: 'abc',
        path: '/:abc/',
      },
      {
        name: 'several',
        path: '/:mine/test/:abc/',
      },
    ];

    const tree = new RouteTree(routes);

    expect(tree.getRoute('/url/test')).toEqual({
      name: 'params',
      path: '/:abc/test/',
      actualPath: '/url/test',
      params: { abc: 'url' },
    });
    expect(tree.getRoute('/test/')).toEqual({
      name: 'test',
      path: '/test/',
      actualPath: '/test/',
      params: {},
    });
    expect(tree.getRoute('/some/')).toEqual({
      name: 'abc',
      path: '/:abc/',
      actualPath: '/some/',
      params: { abc: 'some' },
    });
    expect(tree.getRoute('/some/test/123/')).toEqual({
      name: 'several',
      path: '/:mine/test/:abc/',
      actualPath: '/some/test/123/',
      params: { mine: 'some', abc: '123' },
    });
    expect(tree.getRoute('/some/url/')).toBeUndefined();
  });

  it('test regexp parameters', () => {
    const tree = new RouteTree();
    const route = {
      name: 'regexp',
      path: '/url/:test(^\\d{3}$)',
    };

    tree.addRoute(route);

    expect(tree.getRoute('/url/some/')).toBeUndefined();
    expect(tree.getRoute('/url/1214214/')).toBeUndefined();
    expect(tree.getRoute('/url/456')).toEqual({
      name: 'regexp',
      path: '/url/:test(^\\d{3}$)',
      actualPath: '/url/456',
      params: { test: '456' },
    });
  });

  it('test parameters inside string', () => {
    const routes = [
      {
        name: 'prefix',
        path: '/prefix-:id/',
      },
      {
        name: 'postfix',
        path: '/:a:post/',
      },
      {
        name: 'both',
        path: '/a-:abc:-b/',
      },
      {
        name: 'with regexp',
        path: '/av-:reg(\\d+):-b/',
      },
    ];

    const tree = new RouteTree(routes);

    expect(tree.getRoute('/abc/')).toBeUndefined();
    expect(tree.getRoute('/prefix-523/')).toEqual({
      name: 'prefix',
      path: '/prefix-:id/',
      actualPath: '/prefix-523/',
      params: { id: '523' },
    });
    expect(tree.getRoute('/122post/')).toEqual({
      name: 'postfix',
      path: '/:a:post/',
      actualPath: '/122post/',
      params: { a: '122' },
    });
    expect(tree.getRoute('/a-test-b/')).toEqual({
      name: 'both',
      path: '/a-:abc:-b/',
      actualPath: '/a-test-b/',
      params: { abc: 'test' },
    });
    expect(tree.getRoute('/av-345a-b/')).toBeUndefined();
    expect(tree.getRoute('/av-345-b/')).toEqual({
      name: 'with regexp',
      path: '/av-:reg(\\d+):-b/',
      actualPath: '/av-345-b/',
      params: { reg: '345' },
    });
  });

  it('test optional parameters', () => {
    const routes = [
      {
        name: 'opt',
        path: '/:id?/',
      },
      {
        name: 'opt2',
        path: '/:id?/abc/',
      },
      {
        name: 'opt3',
        path: '/:a?/:b?/:c?',
      },
      {
        name: 'opt4',
        path: '/o/s:abc?:test/',
      },
    ];

    const tree = new RouteTree(routes);

    expect(tree.getRoute('/test/')).toEqual({
      name: 'opt',
      path: '/:id?/',
      actualPath: '/test/',
      params: { id: 'test' },
    });
    expect(tree.getRoute('/me/abc/')).toEqual({
      name: 'opt2',
      path: '/:id?/abc/',
      actualPath: '/me/abc/',
      params: { id: 'me' },
    });
    expect(tree.getRoute('/a/bc/')).toEqual({
      name: 'opt3',
      path: '/:a?/:b?/:c?',
      actualPath: '/a/bc/',
      params: { a: 'a', b: 'bc' },
    });
    expect(tree.getRoute('/o/s345test/')).toEqual({
      name: 'opt4',
      path: '/o/s:abc?:test/',
      actualPath: '/o/s345test/',
      params: { abc: '345' },
    });
    expect(tree.getRoute('/o/a/d/av-345a-b/')).toBeUndefined();
  });

  it('test optional parameters with required', () => {
    const routes = [
      {
        name: 'opt',
        path: '/:param?/path1/',
      },
      {
        name: 'req',
        path: '/:param/path2/',
      },
    ];

    const tree = new RouteTree(routes);

    expect(tree.getRoute('/path1/')).toEqual({
      name: 'opt',
      path: '/:param?/path1/',
      actualPath: '/path1/',
      params: {},
    });
  });

  it('specific parameterized routes', () => {
    const routes = [
      {
        name: 'b',
        path: '/a/b/',
      },
      {
        name: 'params',
        path: '/a/:params',
      },
      {
        name: 'c',
        path: '/a/c/',
      },
    ];

    const tree = new RouteTree(routes);

    expect(tree.getRoute('/a/b/')).toEqual({
      name: 'b',
      path: '/a/b/',
      params: {},
      actualPath: '/a/b/',
    });
    expect(tree.getRoute('/a/test/')).toEqual({
      name: 'params',
      path: '/a/:params',
      params: { params: 'test' },
      actualPath: '/a/test/',
    });
    expect(tree.getRoute('/a/c/')).toEqual({
      name: 'c',
      path: '/a/c/',
      params: {},
      actualPath: '/a/c/',
    });
  });

  it('wildcard routes', () => {
    const routes = [
      {
        name: 'root',
        path: '/',
      },
      {
        name: 'not-found',
        path: '/*',
      },
      {
        name: 'inner',
        path: '/inner/path',
      },
      {
        name: 'inner-not-found',
        path: '/inner/*',
      },
      {
        name: 'a',
        path: '/inner/path/a',
      },
      {
        name: 'deep-not-found',
        path: '/inner/path/*',
      },
    ];

    const tree = new RouteTree(routes);

    expect(tree.getRoute('/')).toMatchObject({ name: 'root' });
    expect(tree.getWildcard('/')).toMatchObject({ name: 'not-found', actualPath: '/' });
    expect(tree.getRoute('/random')).toBeUndefined();
    expect(tree.getWildcard('/random')).toMatchObject({
      name: 'not-found',
      actualPath: '/random',
    });
    expect(tree.getRoute('/inner/path')).toMatchObject({
      name: 'inner',
      actualPath: '/inner/path',
    });
    expect(tree.getWildcard('/inner/new')).toMatchObject({
      name: 'inner-not-found',
      actualPath: '/inner/new',
    });
    expect(tree.getWildcard('/inner/path/a')).toMatchObject({
      name: 'deep-not-found',
      actualPath: '/inner/path/a',
    });
    expect(tree.getWildcard('/inner/path/deep')).toMatchObject({
      name: 'deep-not-found',
      actualPath: '/inner/path/deep',
    });
  });

  it('history fallback routes', () => {
    const routes = [
      {
        name: 'root',
        path: '/',
      },
      {
        name: 'inner',
        path: '/inner',
      },
      {
        name: 'history',
        path: '<history-fallback>',
      },
      {
        name: 'deep-history',
        path: '/inner/<history-fallback>',
      },
    ];

    const tree = new RouteTree(routes);

    expect(tree.getHistoryFallback('/')).toMatchObject({ name: 'history', actualPath: '/' });
    expect(tree.getHistoryFallback('/test')).toMatchObject({ name: 'history', actualPath: '/' });
    expect(tree.getHistoryFallback('/inner')).toMatchObject({
      name: 'deep-history',
      actualPath: '/inner/',
    });
    expect(tree.getHistoryFallback('/inner/test')).toMatchObject({
      name: 'deep-history',
      actualPath: '/inner/',
    });
    expect(tree.getHistoryFallback('/inner/im/going/back/from/this/page')).toMatchObject({
      name: 'deep-history',
      actualPath: '/inner/',
    });
  });

  it('should not return parameterized route', () => {
    const routes = [
      {
        name: 'a',
        path: '/a/:id/',
      },
    ];

    const tree = new RouteTree(routes);

    expect(tree.getRoute('/a/')).toBeUndefined();
  });

  it('should not fall if path contains words from Object.prototype', () => {
    const routes = [
      {
        name: 'root',
        path: '/',
      },
    ];

    const tree = new RouteTree(routes);

    expect(tree.getRoute('/constructor/')).toBeUndefined();
    expect(tree.getRoute('/toString/')).toBeUndefined();
    expect(tree.getRoute('/valueOf/')).toBeUndefined();
    expect(tree.getRoute('/a/b/c/constructor/')).toBeUndefined();
    expect(tree.getRoute('/test/toString/')).toBeUndefined();
  });

  it('should distinct routes with parameter with the same name', () => {
    const routes = [
      {
        name: 'a',
        path: '/:id/inner',
      },
      {
        name: 'b',
        path: '/:id/inner-b',
      },
      {
        name: 'c',
        path: '/:id?/inner',
      },
      {
        name: 'd',
        path: '/prefix-:id/inner',
      },
      {
        name: 'e',
        path: '/:id(\\d+)/inner-e',
      },
      {
        name: 'f',
        path: '/:id(\\d+)/inner',
      },
      {
        name: 'g',
        path: '/outer/:id(\\d+)?/inner',
      },
    ];

    const tree = new RouteTree(routes);

    expect(tree.getRoute('/test/inner')).toMatchObject({ name: 'a' });
    expect(tree.getRoute('/test/inner-b')).toMatchObject({ name: 'b' });
    expect(tree.getRoute('/inner')).toMatchObject({ name: 'c' });
    expect(tree.getRoute('/prefix-435/inner')).toMatchObject({ name: 'd' });
    expect(tree.getRoute('/524/inner-e')).toMatchObject({ name: 'e' });
    expect(tree.getRoute('/524/inner')).toMatchObject({ name: 'f' });
    expect(tree.getRoute('/outer/inner')).toMatchObject({ name: 'g' });
  });

  it('should not add memory leak when adding routes with dynamic parameters', () => {
    const route = {
      name: 'a',
      path: '/:id/',
    };

    const tree = new RouteTree([route]);

    const initialSize = sizeof(tree);

    for (let i = 0; i < 20; i++) {
      tree.addRoute(route);
    }

    expect(sizeof(tree)).toBe(initialSize);
  });

  it('should work for really long urls', () => {
    const url = `/business/rko/partners/form/yandex//business/account/form/money//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form//business/account/form/`;

    const tree = new RouteTree([
      {
        name: 'redirect',
        path: url,
        redirect: '/business/account/',
      },
    ]);

    expect(tree.getRoute(url)).toMatchObject({ name: 'redirect' });
  });
});
