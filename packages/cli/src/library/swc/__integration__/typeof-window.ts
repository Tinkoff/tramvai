let internalFunc: Function;

if (typeof window !== 'undefined') {
  internalFunc = () => "Hello, I'm in browser";
}

if (typeof window === 'undefined') {
  internalFunc = () => "I'm a big server";
}

export const func = () => {
  return internalFunc();
};
