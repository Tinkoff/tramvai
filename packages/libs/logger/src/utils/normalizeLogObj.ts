import type { LogObj } from '../logger.h';

const CIRCULAR_VALUE = '[Circular]';
const DEPTH_LIMIT_VALUE = '[...]';

interface Options {
  /**
   * @default Number.MAX_SAFE_INTEGER
   */
  depthLimit?: number;
}

/**
 * Method for making logObj safe for further traverse and stringify in reporters.
 * Replaced circular references with `[Circular]` string value.
 * Replaced objects deeper than `depthLimit` option  with `[...]` string value.
 */
export const normalizeLogObj = (
  logObj: LogObj,
  options: Options = { depthLimit: Number.MAX_SAFE_INTEGER }
): LogObj => {
  // add logObj to visited for fast detection circular structures like `obj.obj = obj`
  walkByKeys(logObj, 0, new Set([logObj]), options);

  return logObj;
};

function walkByKeys(
  obj: Record<string, any>,
  depth: number,
  visited: Set<Record<string, any>>,
  options: Options
) {
  for (const key in obj) {
    walk(obj, key, depth + 1, visited, options);
  }
}

function walk(
  obj: Record<string, any>,
  key: string,
  depth: number,
  visited: Set<Record<string, any>>,
  options: Options
) {
  const value = obj[key];
  const isObject = typeof value === 'object' && value !== null;

  if (!isObject) {
    return;
  }

  if (visited.has(value)) {
    // eslint-disable-next-line no-param-reassign
    obj[key] = CIRCULAR_VALUE;
    return;
  }

  if (typeof options.depthLimit !== 'undefined' && depth >= options.depthLimit) {
    // eslint-disable-next-line no-param-reassign
    obj[key] = DEPTH_LIMIT_VALUE;
    return;
  }

  visited.add(value);

  walkByKeys(value, depth, visited, options);

  visited.delete(value);
}
