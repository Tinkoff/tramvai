export const createError = (message: string, additional: Record<string, any>) => {
  const err = new Error(message);

  return Object.assign(err, {
    ...additional,
    stack: additional.stack ? `${err.stack}\n---- caused by: ----\n${additional.stack}` : err.stack,
  });
};
