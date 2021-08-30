import { createMockRouter } from './router';

describe('test/unit/mocks/router', () => {
  it('should create router mock', () => {
    const router = createMockRouter();

    expect(router.getCurrentRoute()).toMatchObject({ path: '/' });
    expect(router.getCurrentUrl()).toMatchObject({ path: '/' });
  });

  it('should allow to specify currentRoute', () => {
    const router = createMockRouter({ currentRoute: { name: 'page', path: '/page/test/' } });

    expect(router.getCurrentRoute()).toMatchObject({ path: '/page/test/' });
    expect(router.getCurrentUrl()).toMatchObject({ path: '/page/test/' });
  });
});
