import { useDi } from '@tramvai/react';
import { CHILD_APP_BASE_TOKEN } from './tokens';
// @ts-ignore
import { Cmp } from './__temp__/cmp';

export const BaseCmp = ({ fromRoot }: { fromRoot: string }) => {
  const val = useDi(CHILD_APP_BASE_TOKEN);

  return (
    <>
      <div id="base">Child App: {val}</div>
      <Cmp />
    </>
  );
};
