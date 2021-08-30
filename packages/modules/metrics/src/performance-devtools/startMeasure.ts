function startMeasure(markName: string, uniqueMarkId: number) {
  const uniqueMarkName = `${markName}:${uniqueMarkId}`;

  performance.mark(uniqueMarkName);

  function endMeasure(measureName?: string) {
    try {
      performance.measure(measureName || markName, uniqueMarkName);
    } catch (e) {}

    performance.clearMarks(uniqueMarkName);
  }

  return endMeasure;
}

export { startMeasure };
