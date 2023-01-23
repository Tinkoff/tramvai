---
id: testing
title: Testing
---

#### Testing ROUTER_GUARD_TOKEN extensions

If you have a module or providers that define `ROUTER_GUARD_TOKEN`, then it will be convenient to use special utilities to test them separately

```ts
import { ROUTER_GUARD_TOKEN } from '@tramvai/tokens-router';
import { testGuard } from '@tramvai/module-router/tests';
import { CustomModule } from './module';
import { providers } from './providers';

describe('router guards', () => {
  it('should redirect from guard', async () => {
    const { router } = testGuard({
      providers,
    });

    await router.navigate('/test/');

    expect(router.getCurrentUrl()).toMatchObject({
      path: '/redirect/',
    });
  });

  it('should block navigation', async () => {
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
```
