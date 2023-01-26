import type { PageComponent } from '@tramvai/react';
import { createBundle } from '@tramvai/core';
import { ChildApp } from '@tramvai/module-child-app';
import { useUrl } from '@tramvai/module-router';

const FallbackCmp = ({ error }: { error?: Error }) => {
  if (error) {
    return <div id="fallback">Error fallback</div>;
  }

  return <div id="fallback">Fallback component</div>;
};

const Cmp: PageComponent = () => {
  const { query } = useUrl();

  const fallback = 'fallback' in query ? FallbackCmp : undefined;

  return (
    <>
      <div>Error page still works</div>
      <ChildApp name="error" fallback={fallback} />
    </>
  );
};

Cmp.childApps = [{ name: 'error' }];

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'error',
  components: {
    pageDefault: Cmp,
  },
});
