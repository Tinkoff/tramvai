import type { Server } from 'http';
import type { Application, Request, Response } from 'express';
import stoppable from 'stoppable';
import { promisify } from 'es6-promisify';

export type TerminusOptions = {
  [key: string]: any;
};

const SUCCESS_RESPONSE = JSON.stringify({
  status: 'ok',
});

const FAILURE_RESPONSE = JSON.stringify({
  status: 'error',
});

function noopResolves() {
  return Promise.resolve();
}

async function sendSuccess(res: Response, options) {
  const { info, verbatim } = options;

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  if (info) {
    return res.end(
      JSON.stringify({
        status: 'ok',
        ...(verbatim ? info : { info, details: info }),
      })
    );
  }
  res.end(SUCCESS_RESPONSE);
}

async function sendFailure(res: Response, options) {
  const { error, onSendFailureDuringShutdown } = options;

  if (onSendFailureDuringShutdown) {
    await onSendFailureDuringShutdown();
  }
  res.statusCode = 503;
  res.setHeader('Content-Type', 'application/json');
  if (error) {
    return res.end(
      JSON.stringify({
        status: 'error',
        error,
        details: error,
      })
    );
  }
  res.end(FAILURE_RESPONSE);
}

const intialState = {
  isShuttingDown: false,
};

function noop() {}

function decorateWithHealthCheck(app: Application, state, options) {
  const { healthChecks, logger, onSendFailureDuringShutdown } = options;

  const createHandler = (healthCheck: string) => {
    return (req: Request, res: Response) => {
      if (state.isShuttingDown) {
        return sendFailure(res, { onSendFailureDuringShutdown });
      }
      let info;
      try {
        info = healthChecks[healthCheck]();
      } catch (error) {
        logger('healthcheck failed', error);
        return sendFailure(res, { error: error.causes });
      }
      return sendSuccess(res, { info, verbatim: healthChecks.verbatim });
    };
  };

  for (const key in options.healthChecks) {
    app.get(key, createHandler(key));
  }
}

function decorateWithSignalHandler(server: Server, state, options) {
  const { signals, onSignal, beforeShutdown, onShutdown, timeout, logger } = options;
  const stoppableServer = stoppable(server, timeout);

  const asyncServerStop = promisify(stoppableServer.stop).bind(server);

  async function cleanup(signal) {
    if (!state.isShuttingDown) {
      // eslint-disable-next-line no-param-reassign
      state.isShuttingDown = true;
      try {
        await beforeShutdown();
        await asyncServerStop();
        await onSignal();
        await onShutdown();
        signals.forEach((sig) => process.removeListener(sig, cleanup));
        process.kill(process.pid, signal);
      } catch (error) {
        logger('error happened during shutdown', error);
        process.exit(1);
      }
    }
  }
  signals.forEach((sig) => process.on(sig, cleanup));
}

export function createTerminus(server: Server, app: Application, options: TerminusOptions = {}) {
  const {
    signal = 'SIGTERM',
    signals = [],
    timeout = 1000,
    healthChecks = {},
    onSendFailureDuringShutdown,
    onShutdown = noopResolves,
    beforeShutdown = noopResolves,
    logger = noop,
  } = options;
  const onSignal = options.onSignal || options.onSigterm || noopResolves;
  const state = { ...intialState };

  if (Object.keys(healthChecks).length > 0) {
    decorateWithHealthCheck(app, state, {
      healthChecks,
      logger,
      onSendFailureDuringShutdown,
    });
  }

  // push the signal into the array
  // for backwards compatability
  if (!signals.includes(signal)) signals.push(signal);
  decorateWithSignalHandler(server, state, {
    signals,
    onSignal,
    beforeShutdown,
    onShutdown,
    timeout,
    logger,
  });

  return server;
}
