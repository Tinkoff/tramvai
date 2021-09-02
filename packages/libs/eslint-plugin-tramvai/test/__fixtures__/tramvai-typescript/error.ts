const createApp = (arg) => {
  return arg;
};

createApp({
  modules: [],
  bundles: {
    'tramvai/bundle1': () => import('./bundles/bundle1'),
    'tramvai/bundle2': () => import(/* webpackChunkName: "random" */ './bundles/bundle2'),
  },
});
