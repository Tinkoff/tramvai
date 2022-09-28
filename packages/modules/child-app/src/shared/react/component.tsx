import noop from '@tinkoff/utils/function/noop';
import type { ComponentType } from 'react';
import { createElement, useMemo, useContext, useState, useEffect, Suspense, memo } from 'react';
import type { ChildAppReactConfig } from '@tramvai/tokens-child-app';
import { CHILD_APP_RESOLVE_CONFIG_TOKEN } from '@tramvai/tokens-child-app';
import { CHILD_APP_INTERNAL_RENDER_TOKEN } from '@tramvai/tokens-child-app';
import { LOGGER_TOKEN } from '@tramvai/tokens-common';
import { useDi } from '@tramvai/react';
import type { ExtractDependencyType } from '@tinkoff/dippy';
import { RenderContext } from './render-context';

const FailedChildAppFallback = ({
  name,
  version,
  tag,
  logger,
  fallback: Fallback,
}: {
  name: string;
  version: string;
  tag: string;
  logger: ReturnType<ExtractDependencyType<typeof LOGGER_TOKEN>>;
  fallback: ComponentType<any>;
}) => {
  // On client-side hydration errors will be handled in `hydrateRoot` `onRecoverableError` property,
  // and update errors will be handled in Error Boundaries.
  //
  // Also, this component never be rendered at client-side, and we check environment only for safety
  // (server errors logic described here https://github.com/reactjs/rfcs/blob/main/text/0215-server-errors-in-react-18.md).
  //
  // On server-side, we still use `renderToString`,
  // and need to manually log render errors for components, wrapped in Suspense Boundaries.
  if (typeof window === 'undefined') {
    logger.error({
      event: 'failed-render',
      message: 'child-app failed to render, will try to recover during hydration',
      name,
      version,
      tag,
    });
  }

  return Fallback ? <Fallback /> : null;
};

export const ChildApp = memo(({ name, version, tag, props, fallback }: ChildAppReactConfig) => {
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

    const result = createElement(Cmp, {
      di,
      props,
    });

    if (process.env.__TRAMVAI_CONCURRENT_FEATURES) {
      return (
        <Suspense
          fallback={
            <FailedChildAppFallback
              name={name}
              version={version}
              tag={tag}
              logger={log}
              fallback={fallback}
            />
          }
        >
          {result}
        </Suspense>
      );
    }

    return result;
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
});
