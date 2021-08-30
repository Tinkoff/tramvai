/**
 * @jest-environment jsdom
 */

import { mockPerformance } from './mockPerformance';
import { PerfGauge, PerfHistogram, PerfSummary } from './PerfMetrics';
import { uniqueId } from './uniqueId';

jest.mock('./uniqueId');

describe('Metrics service, client side implementation', () => {
  beforeEach(() => {
    (uniqueId as ReturnType<typeof jest.fn>).mockReturnValueOnce(1).mockReturnValueOnce(2);
  });

  afterEach(() => {
    mockPerformance.clear();
  });

  it('Measurement marks have been cleared', () => {
    const gauge = new PerfGauge({
      name: 'request_measure',
      help: 'Request duration measure',
      registers: [],
    });

    const endTimer = gauge.startTimer();

    endTimer();

    expect(performance.getEntries().length).toBe(1);
  });

  it('Measure duration without labels', () => {
    const histogram = new PerfHistogram({
      name: 'request_measure',
      help: 'Request duration measure',
      registers: [],
    });

    const endTimer = histogram.startTimer();

    endTimer();

    expect(performance.getEntriesByName('request_measure').length).toBe(1);
  });

  it('Measure duration with start labels', () => {
    const gauge = new PerfGauge({
      name: 'request_measure',
      help: 'Request duration measure',
      labelNames: ['method'],
      registers: [],
    });

    const endTimer = gauge.startTimer({ method: 'GET' });

    endTimer();

    expect(performance.getEntriesByName('request_measure{method="GET"}').length).toBe(1);
  });

  it('Measure duration with end labels', () => {
    const gauge = new PerfGauge({
      name: 'request_measure',
      help: 'Request duration measure',
      labelNames: ['status'],
      registers: [],
    });

    const endTimer = gauge.startTimer();

    endTimer({ status: 200 });

    expect(performance.getEntriesByName('request_measure{status="200"}').length).toBe(1);
  });

  it('Measure duration with all labels', () => {
    const histogram = new PerfHistogram({
      name: 'request_measure',
      help: 'Request duration measure',
      labelNames: ['method', 'status'],
      registers: [],
    });

    const endTimer = histogram.startTimer({ method: 'GET' });

    endTimer({ status: 200 });

    expect(performance.getEntriesByName('request_measure{method="GET",status="200"}').length).toBe(
      1
    );
  });

  it('Measured marks do not overlap', () => {
    const summary = new PerfSummary({
      name: 'request_measure',
      help: 'Request duration measure',
      registers: [],
    });

    const endTimerFirst = summary.startTimer();
    const endTimerSecond = summary.startTimer();

    expect(performance.getEntriesByName(`request_measure:1`).length).toBe(1);
    expect(performance.getEntriesByName(`request_measure:2`).length).toBe(1);

    endTimerFirst();
    endTimerSecond();

    expect(performance.getEntriesByName('request_measure').length).toBe(2);
  });
});
