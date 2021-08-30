const mockPerformance = {
  entries: [],
  mark(name: string) {
    this.entries.push({
      name,
      type: 'mark',
      startTime: process.hrtime()[0],
    });
  },
  measure(name: string, start?: string, end?: string) {
    const startEntry = this.getEntriesByName(start)[0];
    const endEntry = this.getEntriesByName(end)[0];
    const startTime = process.hrtime()[0];
    let duration: number;

    if (start && end) {
      duration = endEntry.startTime - startEntry.startTime;
    } else if (start) {
      duration = startTime - startEntry.startTime;
    } else {
      duration = 0;
    }

    this.entries.push({
      name,
      startTime,
      duration,
      type: 'measure',
    });
  },
  clearMarks(name: string) {
    this.entries = this.entries.filter((entry) => {
      return !(entry.type === 'mark' && entry.name === name);
    });
  },
  clearMeasures(name: string) {
    this.entries = this.entries.filter((entry) => {
      return !(entry.type === 'measure' && entry.name === name);
    });
  },
  getEntries() {
    return this.entries;
  },
  getEntriesByName(name: string) {
    return this.entries.filter((entry) => {
      return entry.name === name;
    });
  },
  getEntriesByType(type: string) {
    return this.entries.filter((entry) => {
      return entry.type === type;
    });
  },
  clear() {
    this.entries = [];
  },
};

Object.defineProperty(window, 'performance', {
  writable: true,
  value: mockPerformance,
});

export { mockPerformance };
