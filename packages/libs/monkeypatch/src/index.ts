// eslint-disable-next-line import/no-default-export, func-names
export default function ({
  obj,
  method,
  handler,
  context,
}: {
  obj: Record<string, any>;
  method: any;
  handler(...args: any[]): any;
  context?: Record<string, any>;
}) {
  const original = obj[method];

  // eslint-disable-next-line no-param-reassign
  obj[method] = function methodWrapper(...args: unknown[]) {
    const ctx = context || this;
    args.unshift(original.bind(ctx));
    return handler.apply(ctx, args);
  };

  return original;
}
