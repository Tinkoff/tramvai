import { format } from '@tinkoff/url';

type Args =
  | [Record<string, any> | string | URL, (res: Record<string, any>) => void]
  | [string | URL, Record<string, any>, (res: Record<string, any>) => void];

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

export const createRequestWithMetrics = ({
  metricsInstances: { requestsTotal, requestsErrors, requestsDuration },
  getServiceName,
}) =>
  function requestWithMetrics(originalRequest, ...args: Args) {
    const req = originalRequest.apply(this, args);

    const timerDone = requestsDuration.startTimer();

    const [url, options] = getUrlAndOptions(args);
    const serviceName = getServiceName(url);

    const labelsValues = {
      method: options.method || 'unknown',
      service: serviceName || new URL(url).origin || 'unknown',
      status: 'unknown',
    };

    req.on('response', (res) => {
      labelsValues.status = res.statusCode;
      if (res.statusCode >= 400) {
        requestsErrors.inc(labelsValues);
      }
      requestsTotal.inc(labelsValues);
      timerDone(labelsValues);
    });
    req.on('error', (e) => {
      if (POSSIBLE_ERRORS.includes(e?.code)) {
        labelsValues.status = e.code;
      }

      requestsTotal.inc(labelsValues);
      requestsErrors.inc(labelsValues);
      timerDone(labelsValues);
    });

    return req;
  };
