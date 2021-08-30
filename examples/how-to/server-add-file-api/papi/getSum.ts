import { Request, Response } from '@tramvai/papi';
import { CREATE_CACHE_TOKEN } from '@tramvai/module-common';

// в tramvai.json мы добавили указание на директорию с файловым апи
//       "commands": {
//         "build": {
//           "options": {
//             "server": "server-add-file-api/index.ts",
//             "serverApiDir": "server-add-file-api/papi"
//           }
//         }
//       }
// и теперь каждый файл в этой директории будет обработчиком какого-то урла в зависимости от имени самого файла
// /${appName}/papi/${fileName} т.е. для текушего файла урл будет /server/papi/getSum

// экспортируя переменную rootDeps мы можем запросить зависимости из рутового DI на сервере
// эти записимости будут переданы в handler третьим параметром
export const rootDeps = {
  createCache: CREATE_CACHE_TOKEN,
};

// если зависимости при этом надо как-то изначально проиницилизировать, то можно использовать
// mapDeps который будет вызван один раз, получит в качестве аргумента зависимости из deps, и
// результат этой функции будет использован вместо третьего аргумента в handler
export const mapRootDeps = ({ createCache }: typeof rootDeps) => {
  return {
    cache: createCache('memory'),
  };
};

// handler это наш обработчик который будет вызываться на каждый запрос
// тоже самое будет если сделать export default
export const handler = (req: Request, res: Response, { cache }: ReturnType<typeof mapRootDeps>) => {
  const {
    body: { a, b },
    method,
  } = req;

  if (method !== 'POST') {
    throw new Error('only post methods');
  }

  if (!a || !b) {
    return {
      error: true,
      message: 'body parameters a and b should be set',
    };
  }

  const key = `${a},${b}`;

  if (cache.has(key)) {
    return { error: false, fromCache: true, result: cache.get(key) };
  }

  const result = +a + +b;

  cache.set(key, result);

  return { error: false, fromCache: false, result };
};
