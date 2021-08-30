const contextExecution = typeof window !== 'undefined' ? window : global;

export function scheduling() {
  if ('requestAnimationFrame' in contextExecution) {
    return requestAnimationFrame;
  }
  if ('setImmediate' in contextExecution) {
    return (contextExecution as any).setImmediate;
  }
  return setTimeout;
}
