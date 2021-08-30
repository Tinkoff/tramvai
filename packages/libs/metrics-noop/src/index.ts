/* eslint-disable max-classes-per-file */
export class Counter {
  constructor(configurator: unknown) {}
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
  inc() {}
  dec() {}
  set() {}
  setToCurrentTime() {}
  reset() {}
  remove() {}
  startTimer(labels: unknown) {
    return (endLabels: unknown) => {};
  }

  labels() {
    return {
      inc() {},
      dec() {},
      set() {},
      setToCurrentTime() {},
      startTimer() {
        return (endLabels: unknown) => {};
      },
    };
  }
}

export class Histogram {
  constructor(configurator: unknown) {}
  observe() {}
  startTimer(labels: unknown) {
    return (endLabels: unknown) => {};
  }

  reset() {}
  remove() {}
  labels() {
    return {
      observe() {},
      startTimer() {
        return () => {};
      },
    };
  }
}

export class Summary {
  constructor(configurator: unknown) {}
  observe() {}
  startTimer() {
    return (labels: unknown) => {};
  }

  reset() {}

  labels(labels: unknown) {
    return {
      observe() {},
      startTimer() {
        return (endLabels: unknown) => {};
      },
    };
  }

  remove() {}
}
/* eslint-enable max-classes-per-file */
