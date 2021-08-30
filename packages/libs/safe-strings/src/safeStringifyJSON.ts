const safeStringify: typeof JSON.stringify = (
  value: any,
  replacer: any,
  space: string | number | undefined
) => {
  const seen = new Set();
  const replace = replacer || ((val: string) => val);

  return JSON.stringify(
    value,
    (_, val) => {
      if (!val || typeof val !== 'object') {
        return replace(val);
      }

      if (seen.has(val)) {
        return '[~Circular~]';
      }

      seen.add(val);

      return replace(val);
    },
    space
  );
};

export const safeStringifyJSON: typeof JSON.stringify = (
  value: any,
  replacer: any,
  space: string | number | undefined
) => {
  try {
    return JSON.stringify(value, replacer, space);
  } catch (err) {
    return safeStringify(value, replacer, space);
  }
};
