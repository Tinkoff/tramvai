export function onload(next) {
  let called = false;

  return () => {
    if (!called) {
      called = true;

      const { head } = document;

      next.forEach((entry) => {
        const link = document.createElement('link');

        link.rel = 'preload';
        link.href = entry;
        link.as = 'script';
        link.charset = 'utf-8';
        link.crossOrigin = 'anonymous';

        head.appendChild(link);
      });
    }
  };
}
