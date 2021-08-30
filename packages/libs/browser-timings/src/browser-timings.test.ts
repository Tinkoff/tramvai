/**
 * @jest-environment jsdom
 */

import { browserTimings } from './browser-timings';

const paintMock = [
  {
    duration: 0,
    entryType: 'paint',
    name: 'first-paint',
    startTime: 1078.9400000066962,
  },
];

const timingMock = {
  navigationStart: 1543996403132,
  unloadEventStart: 0,
  unloadEventEnd: 0,
  redirectStart: 0,
  redirectEnd: 0,
  fetchStart: 1543996403146,
  domainLookupStart: 1543996403148,
  domainLookupEnd: 1543996403148,
  connectStart: 1543996403148,
  connectEnd: 1543996403153,
  secureConnectionStart: 1543996403149,
  requestStart: 1543996403155,
  responseStart: 1543996403399,
  responseEnd: 1543996403413,
  domLoading: 1543996403410,
  domInteractive: 1543996403862,
  domContentLoadedEventStart: 1543996404120,
  domContentLoadedEventEnd: 1543996404127,
  domComplete: 1543996404794,
  loadEventStart: 1543996404794,
  loadEventEnd: 1543996404795,
};

const navigateMock = [
  {
    name: 'https://tinkoff.ru/',
    entryType: 'navigation',
    startTime: 0,
    duration: 1890.1200000109384,
    initiatorType: 'navigation',
    nextHopProtocol: 'http/2+quic/44',
    workerStart: 0,
    redirectStart: 0,
    redirectEnd: 0,
    fetchStart: 2.885000008973293,
    domainLookupStart: 9.734999999636784,
    domainLookupEnd: 9.745000003022142,
    connectStart: 9.745000003022142,
    connectEnd: 34.25000001152512,
    secureConnectionStart: 0,
    requestStart: 14.290000006440096,
    responseStart: 807.7250000060303,
    responseEnd: 989.5749999996042,
    transferSize: 87483,
    encodedBodySize: 87128,
    decodedBodySize: 350459,
    serverTiming: [],
    unloadEventStart: 816.7250000115018,
    unloadEventEnd: 817.0350000000326,
    domInteractive: 1347.780000010971,
    domContentLoadedEventStart: 1347.829999998794,
    domContentLoadedEventEnd: 1488.2100000104401,
    domComplete: 1886.0350000031758,
    loadEventStart: 1886.0600000043632,
    loadEventEnd: 1890.1200000109384,
    type: 'reload',
    redirectCount: 0,
  },
];

const resourceMock = [
  {
    connectEnd: 1011.3400000118418,
    connectStart: 1011.3400000118418,
    decodedBodySize: 1211545,
    domainLookupEnd: 1011.3400000118418,
    domainLookupStart: 1011.3400000118418,
    duration: 0,
    encodedBodySize: 239719,
    entryType: 'resource',
    fetchStart: 1011.3400000118418,
    initiatorType: 'script',
    name: 'https://tinkoff.ru/script_foot.js',
    nextHopProtocol: 'http/2+quic/44',
    redirectEnd: 0,
    redirectStart: 0,
    requestStart: 1011.3400000118418,
    responseEnd: 1011.3400000118418,
    responseStart: 1011.3400000118418,
    secureConnectionStart: 1011.3400000118418,
    serverTiming: [],
    startTime: 1011.3400000118418,
    transferSize: 0,
    workerStart: 0,
  },
  {
    connectEnd: 963.7900000088848,
    connectStart: 963.7900000088848,
    decodedBodySize: 204267,
    domainLookupEnd: 963.7900000088848,
    domainLookupStart: 963.7900000088848,
    duration: 5.095000000437722,
    encodedBodySize: 38422,
    entryType: 'resource',
    fetchStart: 963.7900000088848,
    initiatorType: 'link',
    name: 'https://tinkoff.ru/devsite.css',
    nextHopProtocol: 'http/2+quic/44',
    redirectEnd: 0,
    redirectStart: 0,
    requestStart: 965.585000012652,
    responseEnd: 968.8850000093225,
    responseStart: 967.3450000118464,
    secureConnectionStart: 0,
    serverTiming: [],
    startTime: 963.7900000088848,
    transferSize: 0,
    workerStart: 0,
  },
];

describe('browser-timings', () => {
  it('performance объект пустой', () => {
    const result = browserTimings();

    expect(result).toMatchSnapshot();
  });

  it('Получение перфоманс метрик', () => {
    Object.defineProperty(window, 'performance', {
      value: {
        timeOrigin: 1543996403132.6418,
        timing: timingMock,
        navigation: { type: 0, redirectCount: 0 },
        getEntriesByType: (type) => {
          switch (type) {
            case 'navigation':
              return navigateMock;
            case 'resource':
              return resourceMock;
            case 'paint':
              return paintMock;
            default:
              return [];
          }
        },
      },
    });
    const result = browserTimings();

    expect(result).toMatchSnapshot();
  });
});
