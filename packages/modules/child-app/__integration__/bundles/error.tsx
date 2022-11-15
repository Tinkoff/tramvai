import type { PageComponent } from '@tramvai/react';
import { createBundle } from '@tramvai/core';
import { ChildApp } from '@tramvai/module-child-app';

const Cmp: PageComponent = () => {
  return (
    <>
      <div>Error page still works</div>
      <ChildApp name="fail-url" />
    </>
  );
};

Cmp.childApps = [{ name: 'fail-url' }];

// eslint-disable-next-line import/no-default-export
export default createBundle({
  name: 'error',
  components: {
    pageDefault: Cmp,
  },
});
