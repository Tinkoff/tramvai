import { createBundle } from '@tramvai/core';
import { ChildApp } from '@tramvai/module-child-app';
import { useRoute } from '@tramvai/module-router';
import { LayoutComponent } from '../components/layout';

const FallbackCmp = () => {
  return <div>Loading...</div>;
};

const Cmp = () => {
  const route = useRoute();

  return (
    <>
      <div>Content from root</div>
      <div id="root-route">Current route: {route.actualPath}</div>
      <div id="router">
        <ChildApp name="router" fallback={FallbackCmp} />
      </div>
    </>
  );
};

Cmp.childApps = [{ name: 'router' }];

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'router',
  components: {
    pageDefault: Cmp,
    layoutDefault: LayoutComponent,
  },
});
