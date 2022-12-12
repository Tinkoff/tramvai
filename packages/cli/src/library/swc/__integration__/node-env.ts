let internalFunc: Function;

if (process.env.NODE_ENV === 'development') {
  internalFunc = () => 'Are you developer, for sure?';
}

if (process.env.NODE_ENV === 'production') {
  internalFunc = () => 'Nice production ;-)';
}

export const func = () => {
  return internalFunc();
};
