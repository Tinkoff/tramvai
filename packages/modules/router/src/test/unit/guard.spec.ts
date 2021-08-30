import { provide, Module } from '@tramvai/core';
import { ROUTER_GUARD_TOKEN } from '@tramvai/tokens-router';
import { testGuard } from './guard';

describe('router guards', () => {
  it('should run guards', async () => {
    const guard = jest.fn();
    const { router } = testGuard({
      providers: [
        provide({
          provide: ROUTER_GUARD_TOKEN,
          multi: true,
          useValue: guard,
        }),
      ],
    });

    expect(guard).not.toHaveBeenCalled();

    await router.navigate('/test/');

    expect(guard).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.objectContaining({
          path: '/test/',
        }),
      })
    );
  });

  it('should redirect from guard', async () => {
    const { router } = testGuard({
      providers: [
        provide({
          provide: ROUTER_GUARD_TOKEN,
          multi: true,
          useValue: async () => {
            return '/redirect/';
          },
        }),
      ],
    });

    await router.navigate('/test/');

    expect(router.getCurrentUrl()).toMatchObject({
      path: '/redirect/',
    });
  });

  it('should block navigation', async () => {
    @Module({
      providers: [
        provide({
          provide: ROUTER_GUARD_TOKEN,
          multi: true,
          useValue: async () => {
            return false;
          },
        }),
      ],
    })
    class CustomModule {}

    const { router } = testGuard({
      modules: [CustomModule],
    });

    expect(router.getCurrentUrl()).toMatchObject({ path: '/' });

    await router.navigate('/test/').catch(() => null);

    expect(router.getCurrentUrl()).toMatchObject({
      path: '/',
    });
  });
});
