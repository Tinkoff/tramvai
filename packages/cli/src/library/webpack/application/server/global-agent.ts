if (
  (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') &&
  typeof window === 'undefined'
) {
  const { bootstrap } = require('global-agent');

  bootstrap({
    environmentVariableNamespace: '',
  });
}
