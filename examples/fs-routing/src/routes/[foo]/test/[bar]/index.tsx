import type { PageComponent } from '@tramvai/react';
import { useRoute } from '@tramvai/module-router';

export const FooTestBarPage: PageComponent = () => {
  const { foo, bar } = useRoute().params;

  return (
    <div>
      <div>Foo: {foo}</div>
      <div>Bar: {bar}</div>
    </div>
  );
};

export default FooTestBarPage;
