const lazy = (imp) => console.log(imp);
const load = lazy(() => import('./cmp'));

(async () => {
  const {default: cmp} = await import('./cmp');

  console.log((cmp as any).actions)
})();
