import { useContext, useMemo } from 'react';
import mapObj from '@tinkoff/utils/object/map';

import type { ProviderDeps, ProviderDep, ProvideDepsIterator, OptionsType } from '@tinkoff/dippy';
import { DIContext } from './context';

export const useDiContainer = () => {
  const di = useContext(DIContext);

  if (!di) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(`DI-контейнер не найден, убедитесь что в приложении используется 'DIContext.Provider' из '@tramvai/react'
(в tramvai-приложении это обычно делает '@tramvai/module-render', иначе где-то явно должен определяться 'DIContext.Provider' из '@tramvai/react')
Если выше верно, убедитесь, что модуль '@tramvai/react' не дублируется в зависимостях приложения, т.к. в этом случае версии di будут несовместимы`);
    }

    throw new Error('DI-контейнер не найден');
  }

  return di;
};

const isTokenObject = <T>(token: any): token is { token: T } => {
  return (
    'token' in token &&
    (Object.keys(token).length === 1 ||
      typeof token.optional === 'boolean' ||
      typeof token.multi === 'boolean')
  );
};

function useDi<T extends ProviderDep>(
  dep: T
): T extends string
  ? any
  : T extends {
      token: infer OptionsToken;
      optional?: infer OptionsOptional;
      multi?: infer OptionsMulti;
    }
  ? OptionsType<OptionsToken, OptionsMulti, OptionsOptional>
  : T;
function useDi<T extends ProviderDep>(dep: T): T extends string ? any : T;
function useDi<T extends ProviderDeps>(deps: T): ProvideDepsIterator<T>;
function useDi(deps: ProviderDep | ProviderDeps) {
  const di = useDiContainer();

  return useMemo(() => {
    if (deps.toString() !== '[object Object]' || isTokenObject(deps)) {
      return di.get(deps);
    }

    return mapObj((dep) => di.get(dep), deps);
  }, [deps, di]);
}

export { useDi };
