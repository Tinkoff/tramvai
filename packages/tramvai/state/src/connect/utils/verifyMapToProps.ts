import shallowEqual from '@tinkoff/utils/is/shallowEqual';
import { getLogger } from '../../logger';
import type { MapStateToProps } from '../toProps/types';

export const verifyMapToProps = (mapStateToProps: MapStateToProps, name: string) => {
  function verify(state: any, props: any) {
    const firstStateProps = mapStateToProps(state, props);
    const secondStateProps = mapStateToProps(state, props);

    if (!shallowEqual(firstStateProps, secondStateProps)) {
      getLogger().warn(
        'Component "%s" recreate equal props %s',
        name,
        Object.keys(firstStateProps)
          .filter((key) => firstStateProps[key] !== secondStateProps[key])
          .map((key) => `"${key}"`)
          .join(', ')
      );
    }

    (verify as any).dependsOnOwnProps = (mapStateToProps as any).dependsOnOwnProps;
    return secondStateProps;
  }

  return verify;
};
