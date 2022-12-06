export const safeParseJSON = (str: string, defaultValue = null) => {
  // old version of node has memory leak if use json.parse with undefined value https://github.com/nodejs/node/issues/33266#issuecomment-638532113
  if (str === undefined) {
    return defaultValue;
  }
  try {
    return JSON.parse(str);
  } catch (error) {
    return defaultValue;
  }
};
