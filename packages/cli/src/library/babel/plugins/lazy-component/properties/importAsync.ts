import type { PropertyFactory } from './types';

// просто оставляет импорт как есть + добавляет автоматически указание имени чанка для вебпака
export const importAsyncMethod: PropertyFactory = ({ types: t }) => {
  return ({ funcPath }) => {
    return t.objectProperty(t.identifier('importAsync'), funcPath.node);
  };
};
