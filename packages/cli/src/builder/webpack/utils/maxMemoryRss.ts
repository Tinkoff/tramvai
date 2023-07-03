export const maxMemoryRss = () => {
  let maxMemory = process.memoryUsage.rss();

  const interval = setInterval(() => {
    maxMemory = Math.max(maxMemory, process.memoryUsage.rss());
  }, 5000);

  return () => {
    clearInterval(interval);
    return maxMemory;
  };
};
