import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import type { ProviderDeps, ProvideDepsIterator } from '@tinkoff/dippy';
import { useDi } from './hooks';

export const withDi = <T extends ProviderDeps>(deps: T) => <
  C extends React.ComponentType<Partial<ProvideDepsIterator<T>>>
>(
  WrappedComponent: C
) => {
  function WrapperWithPropsFromDi(props: any) {
    const depsInstance = useDi(deps);

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <WrappedComponent {...props} {...depsInstance} />;
  }

  return hoistStatics(WrapperWithPropsFromDi, WrappedComponent) as C;
};
