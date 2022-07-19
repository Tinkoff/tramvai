import { format } from '@tinkoff/url';
import type { ClientRequest } from 'http';
import type { Socket } from 'net';
import type { Args, CreateRequestWithMetrics } from './types';
// https://nodejs.org/api/errors.html#nodejs-error-codes - Common system errors possible for net/http/dns
const POSSIBLE_ERRORS = [
  'EADDRINUSE',
  'ECONNREFUSED',
  'ECONNRESET',
  'ENOTFOUND',
  'EPIPE',
  'ETIMEDOUT',
];

export const getUrlAndOptions = (args: Args) => {
  let url;
  let options;

  // У request первый аргумент либо урл либо объект опций, кейс когда первого аргумента нет не валиден
  const isUrlStringFirst = args[0].constructor === String;
  const isUrlObjectFirst = args[0].constructor === URL;
  const isOptionsFirst = !isUrlStringFirst && !isUrlObjectFirst;
  const isOptionsSecond = !isOptionsFirst && !(args[0] instanceof Function);

  if (isUrlStringFirst) {
    [url] = args;
  }
  if (isUrlObjectFirst) {
    url = format(args[0] as URL);
  }
  if (isOptionsFirst) {
    [options] = args;
    // Тут учитываем случай если передаётся не href в options, а отдельно protocol, host, port, path
    if (options.href) {
      url = options.href;
    } else {
      const urlString = format({
        protocol: options.protocol,
        host: options.hostname || options.host,
        port: options.port,
        pathname: options.path,
      });

      // format где-то внутри делает encodeURIComponent и из-за этого потом не может обрезать query
      try {
        url = decodeURIComponent(urlString);
      } catch {
        url = urlString;
      }
    }
  }
  if (isOptionsSecond) {
    [, options] = args;
  }

  const parsedUrl = new URL(url);
  const urlWOQuery = parsedUrl.origin + parsedUrl.pathname;

  return [urlWOQuery, options || {}];
};

// in seconds
const getDuration = (current: number, prev: number) =>
  // max to avoid negative values and turn that into zero
  prev === 0 ? 0 : Math.max((current - prev) / 1000, 0);

export const createRequestWithMetrics: CreateRequestWithMetrics = ({
  metricsInstances: {
    requestsTotal,
    requestsErrors,
    requestsDuration,
    dnsResolveDuration,
    tcpConnectDuration,
    tlsHandshakeDuration,
  },
  getServiceName,
  config,
}) => {
  const socketSet = new WeakSet<Socket>();

  return function requestWithMetrics(originalRequest, ...args) {
    const [url, options] = getUrlAndOptions(args);
    const serviceName = getServiceName(url);
    const req = originalRequest.apply(this, args) as ClientRequest;
    const timerDone = requestsDuration.startTimer();
    const labelsValues = {
      method: options.method || 'unknown',
      service: serviceName || new URL(url).origin || 'unknown',
      status: 'unknown',
    };

    req.on('response', (res) => {
      labelsValues.status = res.statusCode.toString();
      if (res.statusCode >= 400) {
        requestsErrors.inc(labelsValues);
      }
      requestsTotal.inc(labelsValues);
      timerDone(labelsValues);
    });
    req.on('error', (e: Error & { code?: string }) => {
      if (POSSIBLE_ERRORS.includes(e?.code)) {
        labelsValues.status = req.aborted ? 'aborted' : e.code;
      }

      requestsTotal.inc(labelsValues);
      requestsErrors.inc(labelsValues);
      timerDone(labelsValues);
    });

    if (config.enableConnectionResolveMetrics) {
      req.on('socket', (socket) => {
        // due to keep-alive tcp option sockets might be reused
        // ignore them because they have already emitted events we are interested in
        if (socketSet.has(socket)) {
          return;
        }

        socketSet.add(socket);

        const timings = {
          start: Date.now(),
          lookupEnd: 0,
          connectEnd: 0,
          secureConnectEnd: 0,
        };

        const { service } = labelsValues;
        socket.on('lookup', () => {
          timings.lookupEnd = Date.now();
          dnsResolveDuration.observe({ service }, getDuration(timings.lookupEnd, timings.start));
        });
        socket.on('connect', () => {
          timings.connectEnd = Date.now();
          tcpConnectDuration.observe(
            { service },
            getDuration(timings.connectEnd, timings.lookupEnd)
          );
        });
        socket.on('secureConnect', () => {
          timings.secureConnectEnd = Date.now();
          tlsHandshakeDuration.observe(
            { service },
            getDuration(timings.secureConnectEnd, timings.connectEnd)
          );
        });
        socket.on('close', () => {
          socketSet.delete(socket);
        });
      });
    }

    return req;
  };
};
