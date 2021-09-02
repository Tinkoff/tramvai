const createApp = (arg) => {
  return arg;
};

createApp({
  modules: [],
  bundles: {
    'tramvai/bundle1': () => import(/* webpackChunkName: "bundle1" */ './bundles/bundle1'),
    'tramvai/bundle2': () => import(/* webpackChunkName: "bundle2" */ './bundles/bundle2'),
  },
});
