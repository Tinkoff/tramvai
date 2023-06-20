/* eslint-disable max-classes-per-file */
export class Counter {
  constructor(configurator: unknown) {}
  get(): any {}
  inc() {}
  reset() {}
  remove() {}
  labels() {
    return {
      inc() {},
    };
  }
}

export class Gauge {
  constructor(configurator: unknown) {}
  get(): any {}
  inc() {}
  dec() {}
  set() {}
  setToCurrentTime() {}
  reset() {}
  remove() {}
  startTimer(labels: unknown) {
    return (endLabels: unknown) => 0;
  }

  labels() {
    return {
      inc() {},
      dec() {},
      set() {},
      setToCurrentTime() {},
      startTimer() {
        return (endLabels: unknown) => 0;
      },
    };
  }
}

export class Histogram {
  constructor(configurator: unknown) {}
  get(): any {}
  observe() {}
  startTimer(labels: unknown) {
    return (endLabels: unknown) => 0;
  }

  reset() {}
  remove() {}
  labels() {
    return {
      observe() {},
      startTimer() {
        return () => 0;
      },
    };
  }

  zero() {}
}

export class Summary {
  constructor(configurator: unknown) {}
  get(): any {}
  observe() {}
  startTimer() {
    return (labels: unknown) => 0;
  }

  reset() {}

  labels(labels: unknown) {
    return {
      observe() {},
      startTimer() {
        return (endLabels: unknown) => 0;
      },
    };
  }

  remove() {}
}
/* eslint-enable max-classes-per-file */
