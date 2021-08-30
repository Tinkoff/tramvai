import each from '@tinkoff/utils/object/each';
import flatten from '@tinkoff/utils/array/flatten';
import type { DynamicDescriptor, StaticDescriptor } from './description';
import { isDynamic, isStatic } from './description';
import { HtmlPageStorage } from './storage';

import { recordToTagConverters as converters } from './recordToTagConverters';
import type { ISlotHandler } from './typings/slotHandler';

export type Options = {
  cspToken?: string;
};

type BuildPageParams = {
  description: Array<StaticDescriptor | DynamicDescriptor>;
  slotHandlers: Record<string, ISlotHandler[]>;
  options?: Options;
};

export const buildPage = ({ description, slotHandlers, options = {} }: BuildPageParams): string => {
  const storage = new HtmlPageStorage();

  // register slot handlers
  each(
    (handlers, slot) => handlers.forEach((handler) => storage.registerSlotHandler(slot, handler)),
    slotHandlers
  );

  const result = description.map((descriptor) => {
    if (isDynamic(descriptor)) {
      const { slot } = descriptor;
      storage.runSlotHandlers(slot, options);
      const records = storage.getRecord(slot) || [];
      const convertedRecords = Array.from(records).map((record) => {
        const converter = converters[record.type];
        return converter(record);
      });
      if (process.env.NODE_ENV === 'development') {
        // Добавляем html комментарии для упрощения отладки слотов в dev режиме
        return [
          `<!-- START OF SLOT ${slot} -->`,
          ...convertedRecords,
          `<!-- END OF SLOT ${slot} -->`,
        ];
      }
      return convertedRecords;
    }
    if (isStatic(descriptor)) {
      return descriptor.payload;
    }

    return null;
  });
  return flatten(result).join('\n');
};
