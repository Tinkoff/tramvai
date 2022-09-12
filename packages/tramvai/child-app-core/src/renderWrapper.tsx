import { useMemo } from 'react';
import type { Container } from '@tinkoff/dippy';
import type { ComponentType } from 'react';
import { DIContext } from '@tramvai/react';
import { EXTEND_RENDER } from '@tramvai/tokens-render';

export interface WrapperProps<T extends Record<string, any>> {
  di: Container;
  props: T;
}

export const renderWrapper = <T extends Record<string, any>>(Cmp: ComponentType<T>) => {
  return ({ di, props }: WrapperProps<T>) => {
    const Wrapper = useMemo(() => {
      const wrappers = di.get({
        token: EXTEND_RENDER,
        optional: true,
      });

      let Result = <Cmp {...props} />;

      if (wrappers) {
        for (const wrapper of wrappers) {
          Result = wrapper(Result);
        }
      }

      return Result;
    }, [di, props]);

    return <DIContext.Provider value={di}>{Wrapper}</DIContext.Provider>;
  };
};
