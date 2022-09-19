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

function transformArrayToString(array: string[]) {
  let result = '';
  for (const item of array) {
    result += item;
  }

  return result;
}

export const buildPage = ({ description, slotHandlers, options = {} }: BuildPageParams): string => {
  const storage = new HtmlPageStorage();

  // register slot handlers
  each(
    (handlers, slot) => handlers.forEach((handler) => storage.registerSlotHandler(slot, handler)),
    slotHandlers
  );

  const renderedSlots = description.map((descriptor) => {
    if (isDynamic(descriptor)) {
      const { slot } = descriptor;
      storage.runSlotHandlers(slot, options);
      const records = storage.getRecord(slot) || [];
      const convertedRecords = Array.from(records).map((record) => {
        const converter = converters[record.type];
        return converter(record);
      });
      if (process.env.NODE_ENV === 'development') {
        // Add html comments for debug reasons
        return [
          `\n<!-- START OF SLOT ${slot} -->\n`,
          ...convertedRecords,
          `\n<!-- END OF SLOT ${slot} -->\n`,
        ];
      }
      return convertedRecords;
    }
    if (isStatic(descriptor)) {
      return descriptor.payload;
    }

    return null;
  });

  return transformArrayToString(flatten(renderedSlots));
};
