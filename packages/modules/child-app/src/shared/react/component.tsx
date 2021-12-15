import noop from '@tinkoff/utils/function/noop';
import { createElement, useMemo, useContext, useState, useEffect } from 'react';
import type { ChildAppReactConfig } from '@tramvai/tokens-child-app';
import { CHILD_APP_RESOLVE_CONFIG_TOKEN } from '@tramvai/tokens-child-app';
import { CHILD_APP_INTERNAL_RENDER_TOKEN } from '@tramvai/tokens-child-app';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { useDi } from '@tramvai/react';
import { RenderContext } from './render-context';

export const ChildApp = ({ name, version, tag, props }: ChildAppReactConfig) => {
  const renderManager = useContext(RenderContext);
  const resolveExternalConfig = useDi(CHILD_APP_RESOLVE_CONFIG_TOKEN);
  const logger = useDi(LOGGER_TOKEN);

  const log = logger('child-app:render');
  const [maybeDi, promiseDi] = useMemo(() => {
    return renderManager.getChildDi(resolveExternalConfig({ name, version, tag }));
  }, [name, version, tag, renderManager, resolveExternalConfig]);

  const [di, setDi] = useState(maybeDi);

  useEffect(() => {
    if (!di && promiseDi) {
      // any errors with loading child-app should be handled in some other place
      promiseDi.then(setDi).catch(noop);
    }
  }, [di, promiseDi]);

  if (!di) {
    log.error({
      event: 'not-found',
      name,
      version,
      tag,
      message: 'child-app was not initialized',
    });
    return null;
  }

  try {
    const Cmp = di.get({ token: CHILD_APP_INTERNAL_RENDER_TOKEN, optional: true });

    if (!Cmp) {
      log.error({
        event: 'empty-render',
        message: 'Child-app does not provide render token',
        name,
        version,
        tag,
      });
      return null;
    }

    return createElement(Cmp, {
      di,
      props,
    });
  } catch (error) {
    log.error({
      event: 'get-render',
      message: 'Cannot get render token from child-app',
      error,
      name,
      version,
      tag,
    });
    return null;
  }
};
