type Renderer = (params: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element: any;
  container: Element;
  callback: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) => any;

export { Renderer };
