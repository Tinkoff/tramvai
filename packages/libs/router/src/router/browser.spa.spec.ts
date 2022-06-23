/**
 * @jest-environment jsdom
 */
import { parse } from '@tinkoff/url';
import type { NavigationRoute } from '../types';
import { Router } from './browser';

const mockPush = jest.spyOn(window.history, 'pushState');
const mockReplace = jest.spyOn(window.history, 'replaceState');

// use real timers as some internal logic inside browser routing depends on interval checks
// which really hard to emulate with fake timers
jest.useRealTimers();

const routes = [
  {
    name: 'root',
    path: '/',
  },
  {
    name: 'test',
    path: '/test/',
  },
  {
    name: 'child1',
    path: '/child1/',
  },
  {
    name: 'child2',
    path: '/child2/',
  },
  {
    name: 'dynamic',
    path: '/dynamic/:id/:test?/',
  },
];

const mockHref = jest.fn();

const { location } = window;
// @ts-ignore
delete global.window.location;
global.window.location = { ...location };

let currentLocation = 'http://localhost:3000/';
Object.defineProperty(window.location, 'href', {
  get: () => currentLocation,
  set: (href) => {
    currentLocation = href;
    mockHref(href);
  },
});
Object.defineProperty(window.location, 'assign', {
  get: () => {
    return (href: string) => {
      window.location.href = href;
    };
  },
});
Object.defineProperty(window.location, 'replace', {
  get: () => {
    return (href: string) => {
      window.location.href = href;
    };
  },
});

describe('router/browser-spa', () => {
  let router: Router;

  describe('default trailingSlash treatment', () => {
    beforeEach(() => {
      router = new Router({
        routes,
      });

      mockPush.mockClear();
      mockReplace.mockClear();
    });

    describe('not found', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/dynamic/1/';
        mockHref.mockClear();

        await router.rehydrate({
          type: 'navigate',
          to: {
            name: 'dynamic',
            path: '/dynamic/:id/:test?/',
            actualPath: '/dynamic/1/',
            params: { id: '1' },
          },
          url: parse('http://localhost/dynamic/1/'),
        });
        router.start();
      });

      it('should navigate to external page', async () => {
        // non-blocking as router will block resolving for external navigations
        router.navigate('/random/page/');

        // give code some time to execute async tasks
        await new Promise((resolve) => {
          setTimeout(resolve, 30);
        });

        expect(mockHref).toHaveBeenCalledWith('/random/page/');
      });

      it('should return wildcard route', async () => {
        router.addRoute({
          name: 'notFound',
          path: '*',
        });

        await router.navigate('/random/page/');
        expect(mockHref).not.toHaveBeenCalled();
        expect(router.getCurrentRoute()).toMatchObject({
          name: 'notFound',
          actualPath: '/random/page/',
        });
      });
    });

    describe('updateCurrentRoute', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/dynamic/1/';

        await router.rehydrate({
          type: 'navigate',
          to: {
            name: 'dynamic',
            path: '/dynamic/:id/:test?/',
            actualPath: '/dynamic/1/',
            params: { id: '1' },
          },
          url: parse('http://localhost/dynamic/1/'),
        });
        router.start();
      });

      it('should update dynamic parameters', async () => {
        await router.updateCurrentRoute({ params: { id: '2' } });
        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          params: { id: '2' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/2/');

        await router.updateCurrentRoute({ params: { id: '3', test: 'other' } });
        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          params: { id: '3', test: 'other' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/3/other/');

        await router.updateCurrentRoute({ params: { id: '4', test: undefined } });
        expect(router.getCurrentRoute()).toMatchObject({ name: 'dynamic', params: { id: '4' } });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/4/');
      });

      it('should add options to query list', async () => {
        await router.updateCurrentRoute({ query: { a: 'a', b: 'b' } });

        expect(router.getCurrentUrl()).toMatchObject({
          query: { a: 'a', b: 'b' },
          path: '/dynamic/1/?a=a&b=b',
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/1/?a=a&b=b');

        await router.updateCurrentRoute({ query: { b: 'bb', c: 'c' }, replace: true });

        expect(router.getCurrentUrl()).toMatchObject({
          query: { b: 'bb', c: 'c' },
          path: '/dynamic/1/?b=bb&c=c',
        });
        expect(mockReplace).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/1/?b=bb&c=c');
      });

      it('should replace query list', async () => {
        await router.updateCurrentRoute({ query: { a: 'a', b: 'b' } });

        await router.updateCurrentRoute({ query: { c: 'c' } });

        expect(router.getCurrentUrl()).toMatchObject({
          query: { c: 'c' },
          path: '/dynamic/1/?c=c',
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/1/?c=c');
      });

      it('should update both params and query', async () => {
        await router.updateCurrentRoute({ query: { a: 'a' }, params: { id: '2', test: 'test' } });

        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          params: { id: '2', test: 'test' },
        });
        expect(router.getCurrentUrl()).toMatchObject({
          query: { a: 'a' },
          path: '/dynamic/2/test/?a=a',
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/2/test/?a=a');

        await router.updateCurrentRoute({
          query: { b: 'b', c: 'c' },
          params: { id: '3', test: 'other' },
        });

        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          params: { id: '3', test: 'other' },
        });
        expect(router.getCurrentUrl()).toMatchObject({
          query: { b: 'b', c: 'c' },
          path: '/dynamic/3/other/?b=b&c=c',
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/3/other/?b=b&c=c');
      });

      it('should pass state into route object', async () => {
        await router.updateCurrentRoute({ navigateState: { test: '123' } });

        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          navigateState: { test: '123' },
        });
      });

      it('should remove query parameters', async () => {
        await router.updateCurrentRoute({ query: { a: 'a' } });
        expect(router.getCurrentUrl()?.query).toEqual({ a: 'a' });

        await router.updateCurrentRoute({ query: {} });
        expect(router.getCurrentUrl()?.query).toEqual({});
      });

      it('should remove query parameter with undefined', async () => {
        await router.updateCurrentRoute({ query: { a: 'a', b: 'b' } });
        expect(router.getCurrentUrl()?.query).toEqual({ a: 'a', b: 'b' });

        await router.updateCurrentRoute({ query: { a: undefined }, preserveQuery: true });
        expect(router.getCurrentUrl()?.query).toEqual({ b: 'b' });
      });
    });

    describe('navigate', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });
        router.start();
      });

      it('should navigate to url', async () => {
        await router.navigate('/child1');

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child1' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child1' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child1');

        await router.navigate({ url: '/child2/' });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child2' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child2/' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child2/');
      });

      it('should navigate by query', async () => {
        await router.navigate({ query: { a: '1', b: '2' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({
          path: '/?a=1&b=2',
          query: { a: '1', b: '2' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/?a=1&b=2');

        await router.navigate({ url: '/child1/', query: { a: 'a', c: 'c' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child1' });
        expect(router.getCurrentUrl()).toMatchObject({
          path: '/child1/?a=a&c=c',
          query: { a: 'a', c: 'c' },
        });

        await router.navigate({ url: '/child2/?a=2' });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child2' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child2/?a=2', query: { a: '2' } });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child2/?a=2');
      });

      it('should navigate by query with replace', async () => {
        await router.navigate({ query: { a: '1', b: '2' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({
          path: '/?a=1&b=2',
          query: { a: '1', b: '2' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/?a=1&b=2');

        await router.navigate({ url: '/', query: { a: 'a', c: 'c' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({
          path: '/?a=a&c=c',
          query: { a: 'a', c: 'c' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/?a=a&c=c');
      });

      it('should navigate with replace', async () => {
        await router.navigate({ url: '/child1/', replace: true });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child1' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child1/' });
        expect(mockPush).not.toHaveBeenCalledWith();
        expect(mockReplace).toHaveBeenCalledWith(expect.anything(), '', '/child1/');
      });

      it('should pass state into route object', async () => {
        await router.navigate({ url: '/child1/', navigateState: { test: '123' } });

        expect(router.getCurrentRoute()).toMatchObject({
          name: 'child1',
          navigateState: { test: '123' },
        });
      });
    });

    describe('redirect', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });
        router.start();
      });

      it('should redirect by route', async () => {
        router.addRoute({
          name: 'redirect',
          path: '/redirect/',
          redirect: '/test/',
        });

        const mockGuard = jest.fn();

        router.registerGuard(mockGuard);

        await router.navigate('/redirect/');

        expect(router.getCurrentRoute()).toMatchObject({
          name: 'test',
        });

        expect(mockGuard).toHaveBeenCalledTimes(1);
        expect(mockGuard).toHaveBeenCalledWith(
          expect.objectContaining({
            from: expect.objectContaining({
              path: '/',
            }),
            to: expect.objectContaining({
              path: '/test/',
            }),
            redirectFrom: expect.objectContaining({
              path: '/redirect/',
            }),
          })
        );

        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenLastCalledWith(expect.anything(), '', '/test/');
      });

      it('should redirect saving query parameters', async () => {
        router.addRoute({
          name: 'redirect',
          path: '/redirect/',
          redirect: { url: '/test/', preserveQuery: true },
        });

        await router.navigate({ url: '/redirect/', query: { a: '1', b: '2' } });

        expect(router.getCurrentRoute()).toMatchObject({
          name: 'test',
        });

        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenLastCalledWith(expect.anything(), '', '/test/?a=1&b=2');
      });

      it('should redirect subsequently by route many times', async () => {
        router.addRoute({
          name: 'redirect1',
          path: '/redirect1/',
          redirect: '/redirect2/',
        });

        router.addRoute({
          name: 'redirect2',
          path: '/redirect2/',
          redirect: '/redirect3/',
        });

        router.addRoute({
          name: 'redirect3',
          path: '/redirect3/',
          redirect: '/test/',
        });

        const mockGuard = jest.fn();

        router.registerGuard(mockGuard);

        await router.navigate('/redirect1/');

        expect(router.getCurrentRoute()).toMatchObject({
          name: 'test',
        });

        expect(mockGuard).toHaveBeenCalledTimes(1);
        expect(mockGuard).toHaveBeenCalledWith(
          expect.objectContaining({
            from: expect.objectContaining({
              path: '/',
            }),
            to: expect.objectContaining({
              path: '/test/',
            }),
            redirectFrom: expect.objectContaining({
              path: '/redirect3/',
            }),
          })
        );

        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenLastCalledWith(expect.anything(), '', '/test/');
      });
    });

    describe('hooks', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';
        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });
        router.start();
      });

      it('should run hooks for navigate', async () => {
        const mockBefore = jest.fn();
        const mockAfter = jest.fn();
        const mockResolve = jest.fn();

        router.registerHook('beforeResolve', mockResolve);
        router.registerHook('beforeNavigate', mockBefore);
        router.registerHook('afterNavigate', mockAfter);

        await router.navigate({ url: '/child1', query: { a: '1' }, replace: true });

        const navigation = {
          type: 'navigate',
          replace: true,
          from: { name: 'root', path: '/', actualPath: '/', params: {} },
          to: { name: 'child1', path: '/child1/', actualPath: '/child1', params: {} },
          url: expect.objectContaining({ path: '/child1?a=1' }),
          fromUrl: expect.objectContaining({ path: '/' }),
        };
        expect(mockResolve).toHaveBeenCalledWith({ ...navigation, to: undefined });
        expect(mockBefore).toHaveBeenCalledWith(navigation);
        expect(mockAfter).toHaveBeenCalledWith(navigation);
      });
    });

    describe('sync-hooks', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';
        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });
        router.start();
      });

      it('should run sync hooks for navigate', async () => {
        const mockChange = jest.fn();

        router.registerSyncHook('change', mockChange);

        await router.navigate('/child1/');

        expect(mockChange).toHaveBeenCalledWith(
          expect.objectContaining({
            from: expect.objectContaining({ name: 'root' }),
            fromUrl: expect.objectContaining({ path: '/' }),
            to: expect.objectContaining({ name: 'child1' }),
            url: expect.objectContaining({ path: '/child1/' }),
          })
        );
      });
    });

    describe('guards', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';
        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });

        await router.start();
      });

      it('should call guards', async () => {
        const mockGuard = jest.fn();

        router.registerGuard(mockGuard);

        await router.navigate('/child1');

        expect(mockGuard).toHaveBeenCalledWith({
          type: 'navigate',
          fromUrl: expect.objectContaining({ path: '/' }),
          from: expect.objectContaining({ name: 'root' }),
          to: expect.objectContaining({ name: 'child1' }),
          url: expect.objectContaining({ path: '/child1' }),
        });
        expect(router.getCurrentRoute()).toMatchObject({ name: 'child1' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child1' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child1');
      });

      // TODO: подумать как лучше работать с таким кейсом: блокировать навигацию или делать жёсткий переход?
      it.skip('guards can block navigation', async () => {
        const mockGuard = jest.fn(async () => false);

        router.registerGuard(mockGuard);

        await expect(router.navigate('/child1/')).rejects.toThrow('Navigation blocked');

        expect(mockGuard).toHaveBeenCalledWith({
          type: 'navigate',
          from: expect.objectContaining({ name: 'root' }),
          fromUrl: expect.objectContaining({ path: '/' }),
          to: expect.objectContaining({ name: 'child1' }),
          url: expect.objectContaining({ path: '/child1/' }),
        });
        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/' });
        expect(mockPush).not.toHaveBeenCalledWith();
        expect(mockReplace).not.toHaveBeenCalledWith();
      });

      it('guards can redirect navigation', async () => {
        const mockGuard = jest.fn().mockImplementationOnce(async () => '/child2/');

        router.registerGuard(mockGuard);

        await router.navigate('/child1/');

        expect(mockGuard).toHaveBeenCalledWith({
          type: 'navigate',
          cancelled: true,
          from: expect.objectContaining({ name: 'root' }),
          fromUrl: expect.objectContaining({ path: '/' }),
          to: expect.objectContaining({ name: 'child1' }),
          url: expect.objectContaining({ path: '/child1/' }),
        });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child2' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child2/' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child2/');
      });

      it('guards can redirect navigation while rehydrating', async () => {
        const customRouter = new Router({
          routes,
        });

        const mockGuard = jest.fn().mockImplementationOnce(async () => '/child2/');

        customRouter.registerGuard(mockGuard);

        await customRouter.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });

        expect(mockGuard).toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();

        await customRouter.start();

        expect(customRouter.getCurrentRoute()).toMatchObject({ name: 'child2' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child2/');
      });
    });

    describe('mix', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';
      });
      it('navigation while navigation while navigation', async () => {
        const hook = jest.fn(async ({ to }) => {
          if (to.path === '/child1/') {
            await router.navigate('/child2/');
          }

          if (to.path === '/child2/') {
            await router.navigate('/test/');
          }
        });

        router.registerHook('afterNavigate', hook);

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });

        await router.start();

        await router.navigate('/child1/');

        expect(hook.mock.calls[0][0]).toMatchObject({
          to: expect.objectContaining({ path: '/child1/' }),
        });
        expect(hook.mock.calls[1][0]).toMatchObject({
          to: expect.objectContaining({ path: '/child2/' }),
        });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'test' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/test/');
      });

      it('updateQuery while navigation while rehydration', async () => {
        const guard = jest.fn().mockImplementationOnce(async () => {
          await router.navigate('/test/');
        });
        const hook = jest.fn().mockImplementationOnce(async () => {
          return router.updateCurrentRoute({ query: { a: '1', b: '2' } });
        });

        router.registerGuard(guard);
        router.registerHook('afterNavigate', hook);

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });

        await router.start();

        expect(router.getCurrentRoute()).toMatchObject({ name: 'test' });
        expect(router.getCurrentUrl()).toMatchObject({ query: { a: '1', b: '2' } });

        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/test/?a=1&b=2');
      });

      it('updateCurrentRoute while navigation', async () => {
        const hook = jest.fn();

        router.registerHook('beforeNavigate', async () => {
          return new Promise((resolve) => setTimeout(resolve, 100));
        });
        router.registerHook('afterNavigate', hook);

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });

        await router.start();

        setTimeout(() => {
          router.updateCurrentRoute({ query: { a: '1', b: '2' } });
        }, 0);

        await router.navigate('/test/');

        expect(router.getCurrentRoute()).toMatchObject({ name: 'test' });
        expect(router.getCurrentUrl()).toMatchObject({ query: { a: '1', b: '2' } });

        expect(hook).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/test/?a=1&b=2');
      });

      it('updateCurrentRoute while updateCurrentRoute', async () => {
        const hook = jest.fn().mockImplementationOnce(() => {
          return router.updateCurrentRoute({ query: { b: '2' } });
        });

        router.registerHook('beforeUpdateCurrent', hook);

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });

        await router.start();

        await router.updateCurrentRoute({ query: { a: '1' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({ query: { b: '2' } });

        expect(hook).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/?b=2');
      });

      it('sync-hooks works as expected while navigation', async () => {
        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });

        await router.start();

        router.registerHook('beforeNavigate', async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
        });

        let fromHook: NavigationRoute | undefined;
        let fromRouter: NavigationRoute | undefined;

        router.registerSyncHook('change', ({ to }) => {
          fromHook = to;
          fromRouter = router.getCurrentRoute();
        });

        router.navigate('/child1/');

        await router.navigate('/test/');

        expect(fromHook).toBe(fromRouter);
        expect(router.getCurrentRoute()).toMatchObject({ name: 'test' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/test/');
      });

      it('updateCurrentRoute and updateCurrentRoute while navigation', async () => {
        router.registerHook('beforeNavigate', async () => {
          return new Promise((resolve) => setTimeout(resolve, 100));
        });
        router.registerHook('afterNavigate', async () => {
          return router.updateCurrentRoute({ preserveQuery: false, query: { stage: 'after' } });
        });

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });

        await router.start();

        setTimeout(() => {
          router.updateCurrentRoute({ query: { a: '1', b: '2' } });
        }, 0);

        await router.navigate('/test/');

        expect(router.getCurrentRoute()).toMatchObject({ name: 'test' });
        expect(router.getCurrentUrl()).toMatchObject({ query: { stage: 'after' } });

        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/test/');
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/test/?stage=after');
      });
    });
  });

  describe('trailingSlash force enabled', () => {
    beforeEach(() => {
      router = new Router({
        trailingSlash: true,
        routes,
      });

      mockPush.mockClear();
      mockReplace.mockClear();
    });

    describe('updateCurrentRoute', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/dynamic/1/';

        await router.rehydrate({
          type: 'navigate',
          to: {
            name: 'dynamic',
            path: '/dynamic/:id/:test?/',
            actualPath: '/dynamic/1/',
            params: { id: '1' },
          },
          url: parse('http://localhost/dynamic/1/'),
        });
        router.start();
      });

      it('should update dynamic parameters', async () => {
        await router.updateCurrentRoute({ params: { id: '2' } });
        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          params: { id: '2' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/2/');

        await router.updateCurrentRoute({ params: { id: '3', test: 'other' } });
        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          params: { id: '3', test: 'other' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/3/other/');

        await router.updateCurrentRoute({ params: { id: '4', test: undefined } });
        expect(router.getCurrentRoute()).toMatchObject({ name: 'dynamic', params: { id: '4' } });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/4/');
      });

      it('should add options to query list', async () => {
        await router.updateCurrentRoute({ query: { a: 'a', b: 'b' } });

        expect(router.getCurrentUrl()).toMatchObject({
          query: { a: 'a', b: 'b' },
          path: '/dynamic/1/?a=a&b=b',
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/1/?a=a&b=b');

        await router.updateCurrentRoute({ query: { b: 'bb', c: 'c' }, replace: true });

        expect(router.getCurrentUrl()).toMatchObject({
          query: { b: 'bb', c: 'c' },
          path: '/dynamic/1/?b=bb&c=c',
        });
        expect(mockReplace).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/1/?b=bb&c=c');
      });

      it('should replace query list', async () => {
        await router.updateCurrentRoute({ query: { a: 'a', b: 'b' } });

        await router.updateCurrentRoute({ query: { c: 'c' } });

        expect(router.getCurrentUrl()).toMatchObject({
          query: { c: 'c' },
          path: '/dynamic/1/?c=c',
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/1/?c=c');
      });

      it('should update both params and query', async () => {
        await router.updateCurrentRoute({ query: { a: 'a' }, params: { id: '2', test: 'test' } });

        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          params: { id: '2', test: 'test' },
        });
        expect(router.getCurrentUrl()).toMatchObject({
          query: { a: 'a' },
          path: '/dynamic/2/test/?a=a',
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/2/test/?a=a');

        await router.updateCurrentRoute({
          query: { b: 'b', c: 'c' },
          params: { id: '3', test: 'other' },
        });

        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          params: { id: '3', test: 'other' },
        });
        expect(router.getCurrentUrl()).toMatchObject({
          query: { b: 'b', c: 'c' },
          path: '/dynamic/3/other/?b=b&c=c',
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/3/other/?b=b&c=c');
      });
    });

    describe('navigate', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });
        router.start();
      });

      it('should navigate to url', async () => {
        await router.navigate('/child1');

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child1' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child1/' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child1/');

        await router.navigate({ url: '/child2/' });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child2' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child2/' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child2/');
      });

      it('should navigate by query', async () => {
        await router.navigate({ query: { a: '1', b: '2' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({
          path: '/?a=1&b=2',
          query: { a: '1', b: '2' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/?a=1&b=2');

        await router.navigate({ url: '/child1/', query: { a: 'a', c: 'c' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child1' });
        expect(router.getCurrentUrl()).toMatchObject({
          path: '/child1/?a=a&c=c',
          query: { a: 'a', c: 'c' },
        });

        await router.navigate({ url: '/child2/?a=2' });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child2' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child2/?a=2', query: { a: '2' } });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child2/?a=2');
      });

      it('should navigate by query with replace', async () => {
        await router.navigate({ query: { a: '1', b: '2' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({
          path: '/?a=1&b=2',
          query: { a: '1', b: '2' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/?a=1&b=2');

        await router.navigate({ url: '/', query: { a: 'a', c: 'c' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({
          path: '/?a=a&c=c',
          query: { a: 'a', c: 'c' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/?a=a&c=c');
      });

      it('should navigate with replace', async () => {
        await router.navigate({ url: '/child1/', replace: true });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child1' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child1/' });
        expect(mockPush).not.toHaveBeenCalledWith();
        expect(mockReplace).toHaveBeenCalledWith(expect.anything(), '', '/child1/');
      });
    });

    describe('not found', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';
        mockHref.mockClear();

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });
        router.start();
      });

      it('should navigate to external page without forcing slashes', async () => {
        // non-blocking as router will block resolving for external navigations
        router.navigate('http://test.example/test');

        // give code some time to execute async tasks
        await new Promise((resolve) => {
          setTimeout(resolve, 30);
        });

        expect(mockHref).toHaveBeenCalledWith('http://test.example/test');
      });
    });

    describe('hooks', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });
        router.start();
      });

      it('should run hooks for navigate', async () => {
        const mockBefore = jest.fn();
        const mockAfter = jest.fn();
        const mockResolve = jest.fn();

        router.registerHook('beforeResolve', mockResolve);
        router.registerHook('beforeNavigate', mockBefore);
        router.registerHook('afterNavigate', mockAfter);

        await router.navigate({ url: '/child1', query: { a: '1' }, replace: true });

        const navigation = {
          type: 'navigate',
          replace: true,
          from: { name: 'root', path: '/', actualPath: '/', params: {} },
          to: { name: 'child1', path: '/child1/', actualPath: '/child1/', params: {} },
          url: expect.objectContaining({ path: '/child1/?a=1' }),
          fromUrl: expect.objectContaining({ path: '/' }),
        };
        expect(mockResolve).toHaveBeenCalledWith({ ...navigation, to: undefined });
        expect(mockBefore).toHaveBeenCalledWith(navigation);
        expect(mockAfter).toHaveBeenCalledWith(navigation);
      });
    });

    describe('sync-hooks', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';
        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });
        router.start();
      });

      it('should run sync hooks for navigate', async () => {
        const mockChange = jest.fn();

        router.registerSyncHook('change', mockChange);

        await router.navigate('/child1/');

        expect(mockChange).toHaveBeenCalledWith(
          expect.objectContaining({
            from: expect.objectContaining({ name: 'root' }),
            fromUrl: expect.objectContaining({ path: '/' }),
            to: expect.objectContaining({ name: 'child1' }),
            url: expect.objectContaining({ path: '/child1/' }),
          })
        );
      });
    });

    describe('guards', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });

        router.start();
      });

      it('should call guards', async () => {
        const mockGuard = jest.fn();

        router.registerGuard(mockGuard);

        await router.navigate('/child1');

        expect(mockGuard).toHaveBeenCalledWith({
          type: 'navigate',
          fromUrl: expect.objectContaining({ path: '/' }),
          from: expect.objectContaining({ name: 'root' }),
          to: expect.objectContaining({ name: 'child1' }),
          url: expect.objectContaining({ path: '/child1/' }),
        });
        expect(router.getCurrentRoute()).toMatchObject({ name: 'child1' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child1/' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child1/');
      });

      // TODO: подумать как лучше работать с таким кейсом: блокировать навигацию или делать жёсткий переход?
      it.skip('guards can block navigation', async () => {
        const mockGuard = jest.fn(async () => false);

        router.registerGuard(mockGuard);

        await expect(router.navigate('/child1/')).rejects.toThrow('Navigation blocked');

        expect(mockGuard).toHaveBeenCalledWith({
          type: 'navigate',
          from: expect.objectContaining({ name: 'root' }),
          fromUrl: expect.objectContaining({ path: '/' }),
          to: expect.objectContaining({ name: 'child1' }),
          url: expect.objectContaining({ path: '/child1/' }),
        });
        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/' });
        expect(mockPush).not.toHaveBeenCalledWith();
        expect(mockReplace).not.toHaveBeenCalledWith();
      });

      it('guards can redirect navigation', async () => {
        const mockGuard = jest.fn().mockImplementationOnce(async () => '/child2/');

        router.registerGuard(mockGuard);

        await router.navigate('/child1/');

        expect(mockGuard).toHaveBeenCalledWith({
          type: 'navigate',
          cancelled: true,
          from: expect.objectContaining({ name: 'root' }),
          fromUrl: expect.objectContaining({ path: '/' }),
          to: expect.objectContaining({ name: 'child1' }),
          url: expect.objectContaining({ path: '/child1/' }),
        });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child2' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child2/' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child2/');
      });
    });
  });

  describe('trailingSlash force disabled', () => {
    beforeEach(() => {
      router = new Router({
        trailingSlash: false,
        routes,
      });

      mockPush.mockClear();
      mockReplace.mockClear();
    });

    describe('updateCurrentRoute', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/dynamic/1';
        await router.rehydrate({
          type: 'navigate',
          to: {
            name: 'dynamic',
            path: '/dynamic/:id/:test?/',
            actualPath: '/dynamic/1',
            params: { id: '1' },
          },
          url: parse('http://localhost/dynamic/1'),
        });
        router.start();
      });

      it('should update dynamic parameters', async () => {
        await router.updateCurrentRoute({ params: { id: '2' } });
        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          params: { id: '2' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/2');

        await router.updateCurrentRoute({ params: { id: '3', test: 'other' } });
        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          params: { id: '3', test: 'other' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/3/other');

        await router.updateCurrentRoute({ params: { id: '4', test: undefined } });
        expect(router.getCurrentRoute()).toMatchObject({ name: 'dynamic', params: { id: '4' } });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/4');
      });

      it('should add options to query list', async () => {
        await router.updateCurrentRoute({ query: { a: 'a', b: 'b' } });

        expect(router.getCurrentUrl()).toMatchObject({
          query: { a: 'a', b: 'b' },
          path: '/dynamic/1?a=a&b=b',
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/1?a=a&b=b');

        await router.updateCurrentRoute({ query: { b: 'bb', c: 'c' }, replace: true });

        expect(router.getCurrentUrl()).toMatchObject({
          query: { b: 'bb', c: 'c' },
          path: '/dynamic/1?b=bb&c=c',
        });
        expect(mockReplace).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/1?b=bb&c=c');
      });

      it('should replace query list', async () => {
        await router.updateCurrentRoute({ query: { a: 'a', b: 'b' } });

        await router.updateCurrentRoute({ query: { c: 'c' } });

        expect(router.getCurrentUrl()).toMatchObject({
          query: { c: 'c' },
          path: '/dynamic/1?c=c',
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/1?c=c');
      });

      it('should update both params and query', async () => {
        await router.updateCurrentRoute({ query: { a: 'a' }, params: { id: '2', test: 'test' } });

        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          params: { id: '2', test: 'test' },
        });
        expect(router.getCurrentUrl()).toMatchObject({
          query: { a: 'a' },
          path: '/dynamic/2/test?a=a',
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/2/test?a=a');

        await router.updateCurrentRoute({
          query: { b: 'b', c: 'c' },
          params: { id: '3', test: 'other' },
        });

        expect(router.getCurrentRoute()).toMatchObject({
          name: 'dynamic',
          params: { id: '3', test: 'other' },
        });
        expect(router.getCurrentUrl()).toMatchObject({
          query: { b: 'b', c: 'c' },
          path: '/dynamic/3/other?b=b&c=c',
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/3/other?b=b&c=c');
      });
    });

    describe('navigate', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });
        router.start();
      });

      it('should navigate to url', async () => {
        await router.navigate('/child1');

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child1' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child1' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child1');

        await router.navigate({ url: '/child2/' });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child2' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child2' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child2');
      });

      it('should navigate by query', async () => {
        await router.navigate({ query: { a: '1', b: '2' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({
          path: '/?a=1&b=2',
          query: { a: '1', b: '2' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/?a=1&b=2');

        await router.navigate({ url: '/child1/', query: { a: 'a', c: 'c' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child1' });
        expect(router.getCurrentUrl()).toMatchObject({
          path: '/child1?a=a&c=c',
          query: { a: 'a', c: 'c' },
        });

        await router.navigate({ url: '/child2?a=2' });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child2' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child2?a=2', query: { a: '2' } });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child2?a=2');
      });

      it('should navigate by query with replace', async () => {
        await router.navigate({ query: { a: '1', b: '2' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({
          path: '/?a=1&b=2',
          query: { a: '1', b: '2' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/?a=1&b=2');

        await router.navigate({ url: '/', query: { a: 'a', c: 'c' } });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({
          path: '/?a=a&c=c',
          query: { a: 'a', c: 'c' },
        });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/?a=a&c=c');
      });

      it('should navigate with replace', async () => {
        await router.navigate({ url: '/child1/', replace: true });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child1' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child1' });
        expect(mockPush).not.toHaveBeenCalledWith();
        expect(mockReplace).toHaveBeenCalledWith(expect.anything(), '', '/child1');
      });
    });

    describe('not found', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';
        mockHref.mockClear();

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });
        router.start();
      });

      it('should navigate to external page without forcing slashes', async () => {
        // non-blocking as router will block resolving for external navigations
        router.navigate('http://test.example/test/');

        // give code some time to execute async tasks
        await new Promise((resolve) => {
          setTimeout(resolve, 30);
        });

        expect(mockHref).toHaveBeenCalledWith('http://test.example/test/');
      });
    });

    describe('hooks', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';
        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });
        router.start();
      });

      it('should run hooks for navigate', async () => {
        const mockBefore = jest.fn();
        const mockAfter = jest.fn();
        const mockResolve = jest.fn();

        router.registerHook('beforeResolve', mockResolve);
        router.registerHook('beforeNavigate', mockBefore);
        router.registerHook('afterNavigate', mockAfter);

        await router.navigate({ url: '/child1', query: { a: '1' }, replace: true });

        const navigation = {
          type: 'navigate',
          replace: true,
          from: { name: 'root', path: '/', actualPath: '/', params: {} },
          to: { name: 'child1', path: '/child1/', actualPath: '/child1', params: {} },
          url: expect.objectContaining({ path: '/child1?a=1' }),
          fromUrl: expect.objectContaining({ path: '/' }),
        };
        expect(mockResolve).toHaveBeenCalledWith({ ...navigation, to: undefined });
        expect(mockBefore).toHaveBeenCalledWith(navigation);
        expect(mockAfter).toHaveBeenCalledWith(navigation);
      });
    });

    describe('sync-hooks', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';
        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });
        router.start();
      });

      it('should run sync hooks for navigate', async () => {
        const mockChange = jest.fn();

        router.registerSyncHook('change', mockChange);

        await router.navigate('/child1/');

        expect(mockChange).toHaveBeenCalledWith(
          expect.objectContaining({
            from: expect.objectContaining({ name: 'root' }),
            fromUrl: expect.objectContaining({ path: '/' }),
            to: expect.objectContaining({ name: 'child1' }),
            url: expect.objectContaining({ path: '/child1' }),
          })
        );
      });
    });

    describe('guards', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';
        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });

        router.start();
      });

      it('should call guards', async () => {
        const mockGuard = jest.fn();

        router.registerGuard(mockGuard);

        await router.navigate('/child1/');

        expect(mockGuard).toHaveBeenCalledWith({
          type: 'navigate',
          fromUrl: expect.objectContaining({ path: '/' }),
          from: expect.objectContaining({ name: 'root' }),
          to: expect.objectContaining({ name: 'child1' }),
          url: expect.objectContaining({ path: '/child1' }),
        });
        expect(router.getCurrentRoute()).toMatchObject({ name: 'child1' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child1' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child1');
      });

      // TODO: подумать как лучше работать с таким кейсом: блокировать навигацию или делать жёсткий переход?
      it.skip('guards can block navigation', async () => {
        const mockGuard = jest.fn(async () => false);

        router.registerGuard(mockGuard);

        await expect(router.navigate('/child1/')).rejects.toThrow('Navigation blocked');

        expect(mockGuard).toHaveBeenCalledWith({
          type: 'navigate',
          from: expect.objectContaining({ name: 'root' }),
          fromUrl: expect.objectContaining({ path: '/' }),
          to: expect.objectContaining({ name: 'child1' }),
          url: expect.objectContaining({ path: '/child1' }),
        });
        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/' });
        expect(mockPush).not.toHaveBeenCalledWith();
        expect(mockReplace).not.toHaveBeenCalledWith();
      });

      it('guards can redirect navigation', async () => {
        const mockGuard = jest.fn().mockImplementationOnce(async () => '/child2/');

        router.registerGuard(mockGuard);

        await router.navigate('/child1/');

        expect(mockGuard).toHaveBeenCalledWith({
          type: 'navigate',
          cancelled: true,
          from: expect.objectContaining({ name: 'root' }),
          fromUrl: expect.objectContaining({ path: '/' }),
          to: expect.objectContaining({ name: 'child1' }),
          url: expect.objectContaining({ path: '/child1' }),
        });

        expect(router.getCurrentRoute()).toMatchObject({ name: 'child2' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/child2' });
        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/child2');
      });
    });
  });

  describe('mergeSlashes enabled', () => {
    beforeEach(() => {
      router = new Router({
        trailingSlash: true,
        mergeSlashes: true,
        routes,
      });

      mockPush.mockClear();
      mockReplace.mockClear();
    });

    describe('navigate', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost/';

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost/'),
        });

        await router.start();
      });
      it('should redirect 1', async () => {
        await router.navigate('//');

        expect(router.getCurrentUrl()).toMatchObject({ path: '/' });
      });

      it('should redirect 2', async () => {
        await router.navigate('//////');

        expect(router.getCurrentUrl()).toMatchObject({ path: '/' });
      });
      it('should redirect 3', async () => {
        await router.navigate('/dynamic///213///test///');

        expect(router.getCurrentUrl()).toMatchObject({ path: '/dynamic/213/test/' });
      });
    });
  });
});
