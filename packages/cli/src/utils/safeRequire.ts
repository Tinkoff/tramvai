export default (path: string, silent?: boolean) => {
  try {
    return require(path);
  } catch (error) {
    if (!silent) {
      // TODO: перевести на логгер из di
      console.error(`Require for path ${path} failed`, error);
    }

    return {};
  }
};
