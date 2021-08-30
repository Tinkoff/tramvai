import { Statement } from '@babel/types';
import { PropertyFactory } from './types';

// проверяет на клиенте что нужный чанк загружен и его можно заполучить синхронно
export const isReadyMethod: PropertyFactory = ({ types: t, template }) => {
  const statements = template.ast(`
    const key=this.resolve(props);
    if (this.resolved[key] !== true) {
      return false;
    }

    return !!(__webpack_modules__[key]);
  `);

  return () =>
    t.objectMethod(
      'method',
      t.identifier('isReady'),
      [t.identifier('props')],
      t.blockStatement(statements as Statement[])
    );
};
