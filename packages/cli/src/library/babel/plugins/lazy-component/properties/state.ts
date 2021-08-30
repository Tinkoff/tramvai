import { PropertyFactory } from './types';

// Выставляет внутреннее свойство-мапу `resolved` по которому быстро определяется был ли уже загружен какой-то компонент
// актуально, если нужный компонент загружается динамически в зависимости от пропсов
export const resolvedProperty: PropertyFactory = ({ types: t }) => {
  return () => {
    return t.objectProperty(t.identifier('resolved'), t.objectExpression([]));
  };
};
