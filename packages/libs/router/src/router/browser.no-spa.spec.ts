/**
 * @jest-environment jsdom
 */
import { parse } from '@tinkoff/url';
import { NoSpaRouter } from './clientNoSpa';

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

const mockPush = jest.spyOn(window.history, 'pushState');
const mockReplace = jest.spyOn(window.history, 'replaceState');
const mockHref = jest.fn();

const { location } = window;
// @ts-ignore
delete global.window.location;
global.window.location = { ...location };

jest.useRealTimers();

const backupTimeout = global.setTimeout;
global.setTimeout = ((fn: Function) => fn()) as any;

let currentLocation = 'http://localhost:3000/';

window.location.host = 'localhost:3000';

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

const wrapNotResolved = (promise: Promise<any>) => {
  return new Promise((resolve) => backupTimeout(resolve, 30));
};

describe('router/noSpa', () => {
  let router: NoSpaRouter;

  describe('default trailing slash treatment', () => {
    beforeEach(() => {
      router = new NoSpaRouter({
        routes,
      });
      mockHref.mockClear();
    });

    describe('history implementation', () => {});
    describe('not-found', () => {});
    describe('updateCurrentRoute', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost:3000/dynamic/1/';

        await router.rehydrate({
          type: 'navigate',
          to: {
            name: 'dynamic',
            path: '/dynamic/:id/:test?/',
            actualPath: '/dynamic/1/',
            params: { id: '1' },
          },
          url: parse('http://localhost:3000/dynamic/1/'),
        });

        router.start();
      });

      it('should update dynamic parameters', async () => {
        await wrapNotResolved(router.updateCurrentRoute({ params: { id: '2' } }));

        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/2/');
      });

      it('should add options to query list', async () => {
        await wrapNotResolved(
          router.updateCurrentRoute({ query: { a: 'a', b: 'b' }, replace: true })
        );

        expect(mockReplace).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/1/?a=a&b=b');
      });

      it('should update both params and query', async () => {
        await wrapNotResolved(
          router.updateCurrentRoute({ query: { a: 'aa' }, params: { id: '2', test: 'test' } })
        );

        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/2/test/?a=aa');
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
        window.location.href = 'http://localhost:3000/';

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '', params: {} },
          url: parse('http://localhost:3000/'),
        });
      });

      it('should navigate to url', async () => {
        await wrapNotResolved(router.navigate('/child1'));

        expect(mockHref).toHaveBeenCalledWith('http://localhost:3000/child1');
      });

      it('should navigate by query', async () => {
        await wrapNotResolved(router.navigate({ query: { a: '1', b: '2' } }));

        expect(mockHref).toHaveBeenCalledWith('http://localhost:3000/?a=1&b=2');
      });

      it('should navigate with replace', async () => {
        await wrapNotResolved(router.navigate({ url: '/child2/', replace: true }));

        expect(mockHref).toHaveBeenCalledWith('http://localhost:3000/child2/');
      });
    });
  });

  describe('force trailing slash disable', () => {
    beforeEach(() => {
      router = new NoSpaRouter({
        routes,
        trailingSlash: false,
      });
      mockHref.mockClear();
    });

    describe('history implementation', () => {});
    describe('not found', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost:3000/';
        mockHref.mockClear();

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost:3000/'),
        });
        router.start();
      });

      it('should navigate to external page without forcing slashes', async () => {
        // non-blocking as router will block resolving for external navigations
        await wrapNotResolved(router.navigate('http://test.example/test/'));

        expect(mockHref).toHaveBeenCalledWith('http://test.example/test/');
      });
    });

    describe('updateCurrentRoute', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost:3000/dynamic/1/';
        mockHref.mockClear();

        await router.rehydrate({
          type: 'navigate',
          to: {
            name: 'dynamic',
            path: '/dynamic/:id/:test?/',
            actualPath: '/dynamic/1/',
            params: { id: '1' },
          },
          url: parse('http://localhost:3000/dynamic/1'),
        });

        router.start();
      });

      it('should update dynamic parameters', async () => {
        await wrapNotResolved(router.updateCurrentRoute({ params: { id: '2' } }));

        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/2');
      });

      it('should add options to query list', async () => {
        await wrapNotResolved(router.updateCurrentRoute({ query: { a: 'a', b: 'b' } }));

        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/1?a=a&b=b');
      });

      it('should update both params and query', async () => {
        await wrapNotResolved(
          router.updateCurrentRoute({ query: { a: 'aa' }, params: { id: '2', test: 'test' } })
        );

        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/2/test?a=aa');
      });
    });

    describe('navigate', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost:3000/';
        mockHref.mockClear();

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '', params: {} },
          url: parse('http://localhost:3000/'),
        });
      });

      it('should navigate to url', async () => {
        await wrapNotResolved(router.navigate('/child1'));

        expect(mockHref).toHaveBeenCalledWith('http://localhost:3000/child1');
      });

      it('should navigate by query', async () => {
        await wrapNotResolved(router.navigate({ query: { a: '1', b: '2' } }));

        expect(mockHref).toHaveBeenCalledWith('http://localhost:3000/?a=1&b=2');
      });

      it('should navigate with replace', async () => {
        await wrapNotResolved(router.navigate({ url: '/child2/', replace: true }));

        expect(mockHref).toHaveBeenCalledWith('http://localhost:3000/child2');
      });
    });
  });

  describe('force trailing slash enable', () => {
    beforeEach(() => {
      router = new NoSpaRouter({
        routes,
        trailingSlash: true,
      });
      mockHref.mockClear();
    });

    describe('history implementation', () => {});

    describe('not found', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost:3000/';
        mockHref.mockClear();

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '/', params: {} },
          url: parse('http://localhost:3000/'),
        });
        router.start();
      });

      it('should navigate to external page without forcing slashes', async () => {
        // non-blocking as router will block resolving for external navigations
        await wrapNotResolved(router.navigate('http://test.example/test'));

        expect(mockHref).toHaveBeenCalledWith('http://test.example/test');
      });
    });

    describe('updateCurrentRoute', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost:3000/dynamic/1/';

        await router.rehydrate({
          type: 'navigate',
          to: {
            name: 'dynamic',
            path: '/dynamic/:id/:test?/',
            actualPath: '/dynamic/1/',
            params: { id: '1' },
          },
          url: parse('http://localhost:3000/dynamic/1'),
        });

        router.start();
      });

      it('should update dynamic parameters', async () => {
        await wrapNotResolved(router.updateCurrentRoute({ params: { id: '2' } }));

        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/2/');
      });

      it('should add options to query list', async () => {
        await wrapNotResolved(router.updateCurrentRoute({ query: { a: 'a', b: 'b' } }));

        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/1/?a=a&b=b');
      });

      it('should update both params and query', async () => {
        await wrapNotResolved(
          router.updateCurrentRoute({ query: { a: 'aa' }, params: { id: '2', test: 'test' } })
        );

        expect(mockPush).toHaveBeenCalledWith(expect.anything(), '', '/dynamic/2/test/?a=aa');
      });
    });

    describe('navigate', () => {
      beforeEach(async () => {
        window.location.href = 'http://localhost:3000/';

        await router.rehydrate({
          type: 'navigate',
          to: { name: 'root', path: '/', actualPath: '', params: {} },
          url: parse('http://localhost:3000/'),
        });
      });

      it('should navigate to url', async () => {
        await wrapNotResolved(router.navigate('/child1'));

        expect(mockHref).toHaveBeenCalledWith('http://localhost:3000/child1/');
      });

      it('should navigate by query', async () => {
        await wrapNotResolved(router.navigate({ query: { a: '1', b: '2' } }));

        expect(mockHref).toHaveBeenCalledWith('http://localhost:3000/?a=1&b=2');
      });

      it('should navigate with replace', async () => {
        await wrapNotResolved(router.navigate({ url: '/child2/', replace: true }));

        expect(mockHref).toHaveBeenCalledWith('http://localhost:3000/child2/');
      });
    });
  });
});
