export const safeRequire = (path: string, silent?: boolean) => {
  try {
    return require(path);
  } catch (error) {
    if (!silent) {
      // TODO: replace with logger from di
      console.error(`Require for path ${path} failed`, error);
    }

    return {};
  }
};

export const safeRequireResolve = (path: string, silent?: boolean) => {
  try {
    return require.resolve(path);
  } catch (error) {
    if (!silent) {
      // TODO: replace with logger from di
      console.error(`Require for path ${path} failed`, error);
    }

    return '';
  }
};
