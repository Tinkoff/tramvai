/**
 * terser-webpack-plugin use jest-workers with worker threads - https://github.com/webpack-contrib/terser-webpack-plugin/blob/master/src/index.js#L407
 * used worker from jest-workers pass all execArgv to NodeJS internal worker https://github.com/facebook/jest/blob/main/packages/jest-worker/src/workers/NodeThreadsWorker.ts#L68
 * max_old_space_size is not supported by NodeJS internal workers, and provide this error:
 * Error [ERR_WORKER_INVALID_EXEC_ARGV]: Initiated Worker with invalid execArgv flags: --max_old_space_size=3000
 * So, try to remove this flag inside process manually, before worker threads are initialised.
 * @TODO: Remove after https://github.com/facebook/jest/pull/12097
 */
export const clearExecArgv = () => {
  const index = process.execArgv.findIndex((a) => a.includes('max_old_space_size'));
  process.execArgv.splice(index, 1);
};
