import { PropertyFactory } from './types';

// позволяет получить в рантайме id модуля, который нужно загрузить. В деве это обычно путь к файлу и в @loadable
// это свойство используется преимущественно для логов
export const resolveMethod: PropertyFactory = ({ types: t }) => {
  return ({ importPath, funcPath }) => {
    return t.objectMethod(
      'method',
      t.identifier('resolve'),
      funcPath.node.params ?? [],
      t.blockStatement([
        t.returnStatement(
          t.callExpression(
            t.memberExpression(t.identifier('require'), t.identifier('resolveWeak')),
            [importPath.get('arguments')[0].node]
          )
        ),
      ])
    );
  };
};
