import type { TimingResource } from './browser-timings.h';
import { Timings } from './browser-timings.h';

const toSecond = (timeStamp: number) => Math.round(timeStamp) / 1000;

const testString = (pattern: RegExp) => (text: string) => pattern.test(text);
const isJs = testString(/\.js$/);
const isCSS = testString(/\.css$/);
const isImg = testString(/\.(?:svg|png|jpeg|webp|jpg)$/);
const isFont = testString(/\.(?:woff|eot|woff2|ttf)/);
enum resourceType {
  html = 'html',
  js = 'js',
  css = 'css',
  img = 'img',
  font = 'font',
  other = 'other',
}

const getType = (name: string) => {
  switch (true) {
    case isCSS(name):
      return resourceType.css;
    case isJs(name):
      return resourceType.js;
    case isImg(name):
      return resourceType.img;
    case isFont(name):
      return resourceType.font;
    default:
      return resourceType.other;
  }
};

const getEntriesByType = (performance: Performance, type: string) => {
  if (performance.getEntriesByType) {
    return performance.getEntriesByType(type);
  }
};

const getPaintMetric = (performance: Performance) => {
  const paint = getEntriesByType(performance, 'paint');

  if (paint && paint[0]) {
    return paint[0].startTime;
  }

  return 0;
};

const getTimingResourceValue = (tr: any, key: keyof TimingResource): number => {
  return (tr && tr[key]) || 0;
};

const calculateMetric = (prev: any, next: PerformanceResourceTiming): TimingResource => {
  return {
    duration: getTimingResourceValue(prev, 'duration') + toSecond(next.duration),
    transferSize: getTimingResourceValue(prev, 'transferSize') + next.transferSize,
    encodedBodySize: getTimingResourceValue(prev, 'encodedBodySize') + next.encodedBodySize,
  };
};

const getResourceMetrics = (performance: Performance) => {
  const result = {} as Record<string, any>;

  const entries = getEntriesByType(performance, 'resource') as PerformanceResourceTiming[];
  if (entries && entries.length > 0) {
    entries.forEach((entry) => {
      const name = getType(entry.name.split('?', 1)[0]);

      if (resourceType[name]) {
        result[name] = calculateMetric(result[name], entry);
      }
    });
  }

  const pageNav = getEntriesByType(performance, 'navigation') as PerformanceNavigationTiming[];
  if (pageNav && pageNav.length > 0) {
    result[resourceType.html] = calculateMetric({}, pageNav[0]);
  }

  return result;
};

type TimingsList = Array<{ key: string; start: number; end: number }>;

export function browserTimings(): Timings | {} {
  let performance;
  try {
    // Провряем, есть ли имплементация timing
    performance = window.performance;
    if (!performance.timing || !performance.timing.loadEventEnd) {
      // Если loadEventEnd равен 0, то библиотеку запустили раньше, чем нужно
      if (performance.timing.loadEventEnd === 0) {
        // eslint-disable-next-line no-console
        console.error('Library used at browser initialization page. Reed docs');
      }
      throw new Error('Not implemented timing api');
    }
  } catch (e) {
    return {};
  }

  const {
    requestStart,
    responseStart,
    responseEnd,
    domComplete,
    loadEventEnd,
    domInteractive,
    navigationStart,
  } = performance.timing;
  const timingCandidates: TimingsList = [
    {
      key: 'connection',
      start: navigationStart,
      end: requestStart,
    },
    {
      key: 'backend',
      start: requestStart,
      end: responseStart,
    },
    {
      key: 'pageDownload',
      start: responseStart,
      end: responseEnd,
    },
    {
      key: 'first-paint',
      start: 0,
      end: getPaintMetric(performance),
    },
    {
      key: 'domInteractive',
      start: navigationStart,
      end: domInteractive,
    },
    {
      key: 'domComplete',
      start: navigationStart,
      end: domComplete,
    },
    {
      key: 'pageLoadTime',
      start: navigationStart,
      end: loadEventEnd,
    },
  ];
  const timings: any = {};

  timingCandidates.forEach((el) => {
    const time = toSecond(el.end - el.start);
    // Отсеиваем не стандартные значения меньше 0 секунд и больше 33 минут
    timings[el.key] = time > 0 || time < 2000 ? time : undefined;
  });

  timings.download = getResourceMetrics(performance);

  return timings as Timings;
}

export { Timings };
