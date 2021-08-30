import { Statement } from '@babel/types';
import { PropertyFactory } from './types';

export const requireAsyncMethod: PropertyFactory = ({ types: t, template }) => {
  const tracking = template.ast(`
    const key = this.resolve(props)
    this.resolved[key] = false
    return this.importAsync(props).then(resolved => {
     this.resolved[key] = true
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
