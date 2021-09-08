import type { Statement } from '@babel/types';
import type { PropertyFactory } from './types';

export const requireAsyncMethod: PropertyFactory = ({ types: t, template }) => {
  const tracking = template.ast(`
    const key = this.resolve(props);

    return this.importAsync(props).then(resolved => {
     return resolved;
    });
  `);

  return () =>
    t.objectMethod(
      'method',
      t.identifier('requireAsync'),
      [t.identifier('props')],
      t.blockStatement(tracking as Statement[])
    );
};
