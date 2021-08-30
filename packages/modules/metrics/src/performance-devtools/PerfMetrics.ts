import { Gauge, Histogram, Summary } from '@tinkoff/metrics-noop';
import { startMeasure } from './startMeasure';
import { supportsUserTiming } from './supportsUserTiming';
import { uniqueId } from './uniqueId';

type Labels<T extends string> = Record<T, string | number>;
export function startMeasurePerformance<T extends string>(
  name: string,
  startLabels: Labels<T> = {} as Labels<T>
) {
  if (!supportsUserTiming) {
    return () => {};
  }

  const endMeasure = startMeasure(name, uniqueId());

  return (endLabels: Labels<T> = {} as Labels<T>) => {
    const labels = { ...startLabels, ...endLabels };

    const labelsNames = Object.keys(labels)
      .map((key) => `${key}="${labels[key]}"`)
      .join(',');

    endMeasure(labelsNames && `${name}{${labelsNames}}`);
  };
}

interface PerfMetricConfigurator {
  name: string;
  [key: string]: unknown;
}
export class PerfHistogram extends Histogram {
  name: string;

  constructor(configurator: PerfMetricConfigurator) {
    super(configurator);
    this.name = configurator.name;
  }

  startTimer(startLabels?: Labels<string>) {
    const endMeasure = startMeasurePerformance(this.name, startLabels);

    return (endLabels?: Labels<string>) => {
      endMeasure(endLabels);
    };
  }
}

export class PerfSummary extends Summary {
  name: string;

  constructor(configurator: PerfMetricConfigurator) {
    super(configurator);
    this.name = configurator.name;
  }

  startTimer() {
    const endMeasure = startMeasurePerformance(this.name);

    return (endLabels?: Labels<string>) => {
      endMeasure(endLabels);
    };
  }
}

export class PerfGauge extends Gauge {
  name: string;

  constructor(configurator: PerfMetricConfigurator) {
    super(configurator);
    this.name = configurator.name;
  }

  startTimer(startLabels?: Labels<string>) {
    const endMeasure = startMeasurePerformance(this.name, startLabels);

    return (endLabels?: Labels<string>) => {
      endMeasure(endLabels);
    };
  }
}
