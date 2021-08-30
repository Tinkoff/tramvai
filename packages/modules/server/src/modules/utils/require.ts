export const nodeRequire =
  typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require;

export const safeNodeRequire = (path: string) => {
  try {
    return nodeRequire(path);
  } catch (e) {
    return null;
  }
};
