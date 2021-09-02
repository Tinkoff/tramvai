module.exports = {
  rules: {
    'bundle-chunk-name': require('./rules/bundle-chunk-name').rule,
  },
  configs: {
    recommended: {
      plugins: ['@tinkoff/tramvai'],
      rules: {
        '@tinkoff/tramvai/bundle-chunk-name': 'error',
      },
    },
  },
};
