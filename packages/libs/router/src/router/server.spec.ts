import { Router } from './server';

const routes = [
  {
    name: 'root',
    path: '/',
  },
  {
    name: 'child1',
    path: '/child1/',
  },
  {
    name: 'child1-inner',
    path: '/child1/test/route/',
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

describe('router/server', () => {
  let router: Router;
  const mockRedirect = jest.fn();
  const mockNotFound = jest.fn();
  const mockBlock = jest.fn();

  describe('default trailingSlash treatment', () => {
    beforeEach(() => {
      router = new Router({
        routes,
        onRedirect: mockRedirect,
        onNotFound: mockNotFound,
        onBlock: mockBlock,
      });

      mockRedirect.mockClear();
      mockNotFound.mockClear();
      mockBlock.mockClear();
    });

    describe('not found', () => {
      it('should call notFound handler', async () => {
        await router.navigate('/random/page/');

        expect(mockNotFound).toHaveBeenCalled();
      });

      it('should return wildcard route', async () => {
        router.addRoute({
          name: 'notFound',
          path: '*',
        });

        await router.navigate('/random/page/');
        expect(mockNotFound).not.toHaveBeenCalled();
        expect(router.getCurrentRoute()).toMatchObject({
          name: 'notFound',
          actualPath: '/random/page/',
        });
      });
    });

    describe('updateCurrentRoute', () => {
      it('should throw error on server', async () => {
        await expect(router.updateCurrentRoute({ params: {} })).rejects.toThrow(
          'updateCurrentRoute should only be called after navigate to some route'
        );
      });
    });

    describe('navigate', () => {
      it('should navigate to url', async () => {
        await router.navigate('/');

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/' });
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
      });

      it('navigation without url should throw', async () => {
        await expect(router.navigate({ query: { a: '1' } })).rejects.toThrow(
          'Navigate url should be specified and cannot be omitted for first navigation'
        );

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
      });

      it('should call onRedirect for subsequents navigations', async () => {
        await router.navigate('/child1/');
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();

        await router.navigate('/child2/');
        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            to: null,
            url: expect.objectContaining({ path: '/child2/' }),
          })
        );
        expect(mockNotFound).not.toHaveBeenCalled();
      });

      it('should call onRedirect for subsequents navigations 2', async () => {
        await router.navigate('/child1/');
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();

        await router.navigate('./test/route/');
        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            to: null,
            url: expect.objectContaining({ path: '/child1/test/route/' }),
          })
        );
        expect(mockNotFound).not.toHaveBeenCalled();
      });

      it('should call onNotFound for unknown routes', async () => {
        await router.navigate('/unknown/');

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ path: '/unknown/' }),
          })
        );
      });

      it('should call onRedirect for strange urls', async () => {
        await router.navigate('/test//213124///');

        expect(mockRedirect).not.toHaveBeenCalledWith(
          expect.objectContaining({
            to: null,
            url: expect.objectContaining({ path: '/test/213124/' }),
          })
        );
      });
    });

    describe('redirect', () => {
      it('should redirect by route', async () => {
        router.addRoute({
          name: 'redirect',
          path: '/redirect/',
          redirect: '/test/',
        });

        await router.navigate('/redirect/');

        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ path: '/test/' }),
          })
        );
      });
      it('should redirect saving query parameters', async () => {
        router.addRoute({
          name: 'redirect',
          path: '/redirect/',
          redirect: { url: '/test/', preserveQuery: true },
        });

        await router.navigate({ url: '/redirect/', query: { a: '1', b: '2' } });

        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ path: '/test/?a=1&b=2' }),
          })
        );
      });

      it('should redirect to external url', async () => {
        router.addRoute({
          name: 'redirect',
          path: '/redirect/',
          redirect: 'https://tinkoff.ru/eng/media/',
        });

        await router.navigate({ url: '/redirect/', query: { a: '1', b: '2' } });

        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ href: 'https://tinkoff.ru/eng/media/' }),
          })
        );
      });
    });

    describe('hooks', () => {
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
          to: { name: 'child1', path: '/child1/', actualPath: '/child1', params: {} },
          url: expect.objectContaining({ path: '/child1?a=1' }),
        };
        expect(mockResolve).toHaveBeenCalledWith({ ...navigation, to: undefined });
        expect(mockBefore).toHaveBeenCalledWith(navigation);
        expect(mockAfter).toHaveBeenCalledWith(navigation);
      });
    });
    describe('sync-hooks', () => {
      it('should run sync hooks for navigate', async () => {
        const mockChange = jest.fn();

        router.registerSyncHook('change', mockChange);

        await router.navigate('/');

        expect(mockChange).toHaveBeenCalledWith(
          expect.objectContaining({
            to: expect.objectContaining({ name: 'root' }),
            url: expect.objectContaining({ path: '/' }),
          })
        );
      });
    });
    describe('guards', () => {
      it('should call guards', async () => {
        const mockGuard = jest.fn();

        router.registerGuard(mockGuard);

        await router.navigate('/child1/');

        expect(mockGuard).toHaveBeenCalledWith(
          expect.objectContaining({
            from: undefined,
            to: expect.objectContaining({ name: 'child1' }),
            url: expect.objectContaining({ path: '/child1/' }),
          })
        );
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
        expect(mockBlock).not.toHaveBeenCalled();
      });
      it('guards can block navigation', async () => {
        const mockGuard = jest.fn(async () => false);

        router.registerGuard(mockGuard);

        await router.navigate('/child1');

        expect(mockGuard).toHaveBeenCalledWith(
          expect.objectContaining({
            from: undefined,
            to: expect.objectContaining({ name: 'child1' }),
            url: expect.objectContaining({ path: '/child1' }),
          })
        );
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
        expect(mockBlock).toHaveBeenCalled();
      });
      it('guards can redirect navigation', async () => {
        const mockGuard = jest.fn(async () => '/child2/');

        router.registerGuard(mockGuard);

        await router.navigate('/child1/');

        expect(mockGuard).toHaveBeenCalledWith(
          expect.objectContaining({
            from: undefined,
            to: expect.objectContaining({ name: 'child1' }),
            url: expect.objectContaining({ path: '/child1/' }),
          })
        );
        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ path: '/child2/' }),
          })
        );
        expect(mockNotFound).not.toHaveBeenCalled();
        expect(mockBlock).not.toHaveBeenCalled();
      });
    });
  });

  describe('trailingSlash force enabled', () => {
    beforeEach(() => {
      router = new Router({
        trailingSlash: true,
        routes,
        onRedirect: mockRedirect,
        onNotFound: mockNotFound,
        onBlock: mockBlock,
      });

      mockRedirect.mockClear();
      mockNotFound.mockClear();
      mockBlock.mockClear();
    });

    describe('updateCurrentRoute', () => {
      it('should throw error on server', async () => {
        await expect(router.updateCurrentRoute({ params: {} })).rejects.toThrow(
          'updateCurrentRoute should only be called after navigate to some route'
        );
      });
    });

    describe('navigate', () => {
      it('should navigate to url', async () => {
        await router.navigate('/');

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/' });
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
      });

      it('navigation without url should throw', async () => {
        await expect(router.navigate({ query: { a: '1' } })).rejects.toThrow(
          'Navigate url should be specified and cannot be omitted for first navigation'
        );

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
      });

      it('should call onRedirect for subsequents navigations', async () => {
        await router.navigate('/child1/');
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();

        await router.navigate('/child2/');
        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            to: null,
            url: expect.objectContaining({ path: '/child2/' }),
          })
        );
        expect(mockNotFound).not.toHaveBeenCalled();
      });

      it('should call onRedirect for subsequents navigations 2', async () => {
        await router.navigate('/child1/');
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();

        await router.navigate('./test/route');
        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            to: null,
            url: expect.objectContaining({ path: '/child1/test/route/' }),
          })
        );
        expect(mockNotFound).not.toHaveBeenCalled();
      });

      it('should call onNotFound for unknown routes', async () => {
        await router.navigate('/unknown/');

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ path: '/unknown/' }),
          })
        );
      });

      it('should call redirect when trailing slash do not satisfy', async () => {
        await router.navigate('/child1');

        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            to: null,
            url: expect.objectContaining({ path: '/child1/' }),
          })
        );
      });

      it('should call redirect when trailing slash do not satisfy dynamic route', async () => {
        await router.navigate('/dynamic/la.la/path');

        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            to: null,
            url: expect.objectContaining({ path: '/dynamic/la.la/path/' }),
          })
        );
      });
    });
    describe('hooks', () => {
      it('should run hooks for navigate', async () => {
        const mockBefore = jest.fn();
        const mockAfter = jest.fn();
        const mockResolve = jest.fn();

        router.registerHook('beforeResolve', mockResolve);
        router.registerHook('beforeNavigate', mockBefore);
        router.registerHook('afterNavigate', mockAfter);

        await router.navigate({ url: '/child1/', query: { a: '1' }, replace: true });

        const navigation = {
          type: 'navigate',
          replace: true,
          to: { name: 'child1', path: '/child1/', actualPath: '/child1/', params: {} },
          url: expect.objectContaining({ path: '/child1/?a=1' }),
        };

        expect(mockResolve).toHaveBeenCalledWith({ ...navigation, to: undefined });
        expect(mockBefore).toHaveBeenCalledWith(navigation);
        expect(mockAfter).toHaveBeenCalledWith(navigation);
      });
    });
    describe('sync-hooks', () => {
      it('should run sync hooks for navigate', async () => {
        const mockChange = jest.fn();

        router.registerSyncHook('change', mockChange);

        await router.navigate('/');

        expect(mockChange).toHaveBeenCalledWith(
          expect.objectContaining({
            to: expect.objectContaining({ name: 'root' }),
            url: expect.objectContaining({ path: '/' }),
          })
        );
      });
    });
    describe('guards', () => {
      it('should call guards', async () => {
        const mockGuard = jest.fn();

        router.registerGuard(mockGuard);

        await router.navigate('/child1/');

        expect(mockGuard).toHaveBeenCalledWith(
          expect.objectContaining({
            from: undefined,
            to: expect.objectContaining({ name: 'child1' }),
            url: expect.objectContaining({ path: '/child1/' }),
          })
        );
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
        expect(mockBlock).not.toHaveBeenCalled();
      });
      it('guards can block navigation', async () => {
        const mockGuard = jest.fn(async () => false);

        router.registerGuard(mockGuard);

        await router.navigate('/child1/');

        expect(mockGuard).toHaveBeenCalledWith(
          expect.objectContaining({
            from: undefined,
            to: expect.objectContaining({ name: 'child1' }),
            url: expect.objectContaining({ path: '/child1/' }),
          })
        );
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
        expect(mockBlock).toHaveBeenCalled();
      });
      it('guards can redirect navigation', async () => {
        const mockGuard = jest.fn(async () => '/child2/');

        router.registerGuard(mockGuard);

        await router.navigate('/child1/');

        expect(mockGuard).toHaveBeenCalledWith(
          expect.objectContaining({
            from: undefined,
            to: expect.objectContaining({ name: 'child1' }),
            url: expect.objectContaining({ path: '/child1/' }),
          })
        );
        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ path: '/child2/' }),
          })
        );
        expect(mockNotFound).not.toHaveBeenCalled();
        expect(mockBlock).not.toHaveBeenCalled();
      });
    });
  });

  describe('trailingSlash force disabled', () => {
    beforeEach(() => {
      router = new Router({
        trailingSlash: false,
        routes,
        onRedirect: mockRedirect,
        onNotFound: mockNotFound,
        onBlock: mockBlock,
      });

      mockRedirect.mockClear();
      mockNotFound.mockClear();
      mockBlock.mockClear();
    });

    describe('updateCurrentRoute', () => {
      it('should throw error on server', async () => {
        await expect(router.updateCurrentRoute({ params: {} })).rejects.toThrow(
          'updateCurrentRoute should only be called after navigate to some route'
        );
      });
    });

    describe('navigate', () => {
      it('should navigate to url', async () => {
        await router.navigate('/');

        expect(router.getCurrentRoute()).toMatchObject({ name: 'root' });
        expect(router.getCurrentUrl()).toMatchObject({ path: '/' });
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
      });

      it('navigation without url should throw', async () => {
        await expect(router.navigate({ query: { a: '1' } })).rejects.toThrow(
          'Navigate url should be specified and cannot be omitted for first navigation'
        );

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
      });

      it('should call onRedirect for subsequents navigations', async () => {
        await router.navigate('/child1');
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();

        await router.navigate('/child2');
        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            to: null,
            url: expect.objectContaining({ path: '/child2' }),
          })
        );
        expect(mockNotFound).not.toHaveBeenCalled();
      });

      it('should call onRedirect for subsequents navigations 2', async () => {
        await router.navigate('/child1');
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();

        await router.navigate('./child1/test/route/');
        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            to: null,
            url: expect.objectContaining({ path: '/child1/test/route' }),
          })
        );
        expect(mockNotFound).not.toHaveBeenCalled();
      });

      it('should call onNotFound for unknown routes', async () => {
        await router.navigate('/unknown');

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ path: '/unknown' }),
          })
        );
      });

      it('should call onRedirect if trailing slash do not satisfy', async () => {
        await router.navigate('/child2/');

        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            to: null,
            url: expect.objectContaining({ path: '/child2' }),
          })
        );
      });
    });
    describe('hooks', () => {
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
          to: { name: 'child1', path: '/child1/', actualPath: '/child1', params: {} },
          url: expect.objectContaining({ path: '/child1?a=1' }),
        };
        expect(mockResolve).toHaveBeenCalledWith({ ...navigation, to: undefined });
        expect(mockBefore).toHaveBeenCalledWith(navigation);
        expect(mockAfter).toHaveBeenCalledWith(navigation);
      });
    });
    describe('sync-hooks', () => {
      it('should run sync hooks for navigate', async () => {
        const mockChange = jest.fn();

        router.registerSyncHook('change', mockChange);

        await router.navigate('/');

        expect(mockChange).toHaveBeenCalledWith(
          expect.objectContaining({
            to: expect.objectContaining({ name: 'root' }),
            url: expect.objectContaining({ path: '/' }),
          })
        );
      });
    });
    describe('guards', () => {
      it('should call guards', async () => {
        const mockGuard = jest.fn();

        router.registerGuard(mockGuard);

        await router.navigate('/child1');

        expect(mockGuard).toHaveBeenCalledWith(
          expect.objectContaining({
            from: undefined,
            to: expect.objectContaining({ name: 'child1' }),
            url: expect.objectContaining({ path: '/child1' }),
          })
        );
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
        expect(mockBlock).not.toHaveBeenCalled();
      });
      it('guards can block navigation', async () => {
        const mockGuard = jest.fn(async () => false);

        router.registerGuard(mockGuard);

        await router.navigate('/child1');

        expect(mockGuard).toHaveBeenCalledWith(
          expect.objectContaining({
            from: undefined,
            to: expect.objectContaining({ name: 'child1' }),
            url: expect.objectContaining({ path: '/child1' }),
          })
        );
        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
        expect(mockBlock).toHaveBeenCalled();
      });
      it('guards can redirect navigation', async () => {
        const mockGuard = jest.fn(async () => '/child2');

        router.registerGuard(mockGuard);

        await router.navigate('/child1');

        expect(mockGuard).toHaveBeenCalledWith(
          expect.objectContaining({
            from: undefined,
            to: expect.objectContaining({ name: 'child1' }),
            url: expect.objectContaining({ path: '/child1' }),
          })
        );
        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ path: '/child2' }),
          })
        );
        expect(mockNotFound).not.toHaveBeenCalled();
        expect(mockBlock).not.toHaveBeenCalled();
      });
    });
  });

  describe('mergeSlashes enabled', () => {
    beforeEach(() => {
      router = new Router({
        trailingSlash: true,
        mergeSlashes: true,
        routes,
        onRedirect: mockRedirect,
        onNotFound: mockNotFound,
        onBlock: mockBlock,
      });

      mockRedirect.mockClear();
      mockNotFound.mockClear();
      mockBlock.mockClear();
    });

    describe('navigate', () => {
      it('should redirect 1', async () => {
        await router.navigate('//');

        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ path: '/' }),
          })
        );
      });

      it('should redirect 2', async () => {
        await router.navigate('http://localhost:3000//');

        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ path: '/' }),
          })
        );
      });

      it('should redirect 3', async () => {
        await router.navigate('http://localhost:3000/////');

        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ path: '/' }),
          })
        );
      });

      it('should redirect 4', async () => {
        await router.navigate('/dynamic///id///');

        expect(mockRedirect).toHaveBeenCalledWith(
          expect.objectContaining({
            url: expect.objectContaining({ path: '/dynamic/id/' }),
          })
        );
      });

      it('should not redirect', async () => {
        await router.navigate('http://localhost:3000/child1/?test=abc');

        expect(mockRedirect).not.toHaveBeenCalled();
        expect(mockNotFound).not.toHaveBeenCalled();
        expect(mockBlock).not.toHaveBeenCalled();
      });
    });
  });
});
