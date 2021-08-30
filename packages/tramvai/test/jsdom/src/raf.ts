export const waitRaf = () =>
  new Promise((resolve) => {
    requestAnimationFrame(resolve);
    // requestAnimationFrame with legacy timers after PR https://github.com/facebook/jest/pull/11567 works on top setTimeout
    jest.runAllTimers();
  });
