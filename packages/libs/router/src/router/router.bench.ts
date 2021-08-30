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

const createRouter = () => {
  return new Router({
    routes,
    onRedirect: async () => {},
    onBlock: async () => {},
    onNotFound: async () => {},
  });
};

export const createRouterAndNavigate = {
  async root() {
    const router = createRouter();

    await router.navigate({ url: 'http://localhost:3000/' });
  },
  async staticRoute() {
    const router = createRouter();

    await router.navigate({ url: '/child1/' });
  },
  async dynamicRoute() {
    const router = createRouter();

    await router.navigate({ url: '/dynamic/2/' });
  },
};
