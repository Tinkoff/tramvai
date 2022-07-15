import type { PropertyFactory } from './types';

// позволяет загрузить модуль синхронно - нужно на сервере и чтобы не выполнять повторную загрузку,
// если чанк уже был загружен ранее на клиенте
export const requireSyncMethod: PropertyFactory = ({ types: t, template }) => {
  return () =>
    t.objectMethod(
      'method',
      t.identifier('requireSync'),
      [t.identifier('props')],
      t.blockStatement([
        t.returnStatement(
          t.callExpression(t.identifier('__webpack_require__'), [
            t.callExpression(t.memberExpression(t.thisExpression(), t.identifier('resolve')), [
              t.identifier('props'),
            ]),
          ])
        ),
      ])
    );
};
