import isString from '@tinkoff/utils/is/string';
import isNumber from '@tinkoff/utils/is/number';
import isObject from '@tinkoff/utils/is/object';
import isArray from '@tinkoff/utils/is/array';
import omit from '@tinkoff/utils/object/omit';

import type { LogObj } from '../../logger.h';
import { LEVEL_NAMES } from '../../constants';
import { formatJson } from './formatJson';

type LevelString = 'FATAL' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export interface SageOptions {
  env?: string;
  system?: string;
  inst?: string;
}

interface SageJsonLog extends SageOptions {
  level: LevelString;
  '@timestamp': Date;
  levelNumber: number;
  message: (string | number)[];
  arrays?: unknown[][];
  objects?: Record<string, any>[];
}

export const formatSageJsonFactory = ({ env, system, inst }: SageOptions) => {
  return (logObj: LogObj): SageJsonLog => {
    const formattedLog = formatJson(logObj);
    const { args } = formattedLog;
    // На уровне языка запросов mage работа со строкой или объектом не отличается от работы с массивом
    // строк или объектов, но при этом индексируются только гомогенные массивы (за исключением string
    // и number, массив из этих двух типов индексируется нормально).
    // Поэтому разделяем аргументы по типам на массивы, а string и number пишем в
    // message.
    interface DevidedArgs {
      message: SageJsonLog['message'];
      arrays?: SageJsonLog['arrays'];
      objects?: SageJsonLog['objects'];
    }
    const devidedArgs: DevidedArgs = { message: [formattedLog.message] };

    if (args) {
      args.forEach((arg) => {
        if (arg === null || arg === undefined) {
          return;
        }

        if (isString(arg) || isNumber(arg)) {
          devidedArgs.message.push(arg);
        } else if (isArray(arg)) {
          if (!devidedArgs.arrays) {
            devidedArgs.arrays = [];
          }

          devidedArgs.arrays.push(arg);
        } else if (isObject(arg)) {
          if (!devidedArgs.objects) {
            devidedArgs.objects = [];
          }

          devidedArgs.objects.push(arg);
        }
      });
    }

    return {
      ...omit(['args'], formattedLog),
      ...devidedArgs,
      level: LEVEL_NAMES[logObj.level].toUpperCase(),
      levelNumber: logObj.level,
      '@timestamp': logObj.date,
      env,
      system,
      inst,
    };
  };
};
