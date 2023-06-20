function startMeasure(markName: string, uniqueMarkId: number) {
  const uniqueMarkName = `${markName}:${uniqueMarkId}`;

  performance.mark(uniqueMarkName);

  function endMeasure(measureName?: string) {
    let duration = 0;

    try {
      duration = performance.measure(measureName || markName, uniqueMarkName).duration;
    } catch (e) {}

    performance.clearMarks(uniqueMarkName);

    return duration;
  }

  return endMeasure;
}

export { startMeasure };
