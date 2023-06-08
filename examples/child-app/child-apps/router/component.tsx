import { useRoute, Link } from '@tramvai/module-router';

export const RouterCmp = () => {
  const { actualPath } = useRoute();

  return (
    <>
      <div id="path">Actual Path: {actualPath}</div>

      <footer style={{ paddingTop: '2000px' }}>
        <Link url="/react-query">Link to /react-query</Link>
      </footer>
    </>
  );
};
