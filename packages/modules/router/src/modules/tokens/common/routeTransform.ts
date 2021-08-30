import identity from '@tinkoff/utils/function/identity';
import compose from '@tinkoff/utils/function/compose';
import flatten from '@tinkoff/utils/array/flatten';

import type { ROUTE_TRANSFORM_TOKEN } from '@tramvai/tokens-router';
import type { routeTransformToken } from '../../tokens';

export const routeTransform = ({
  transformers,
}: {
  transformers?: Array<typeof ROUTE_TRANSFORM_TOKEN>;
}): typeof routeTransformToken => {
  if (!transformers || transformers.length === 0) {
    return identity;
  }

  return compose(...flatten<typeof ROUTE_TRANSFORM_TOKEN>(transformers));
};
