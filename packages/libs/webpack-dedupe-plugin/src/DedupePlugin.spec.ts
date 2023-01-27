import type { NMFResult } from './DedupePlugin';
import { createCacheKeyFromNMFResult } from './DedupePlugin';

const resourceWithoutData: NMFResult = {};

const resourceWithoutVersion: NMFResult = {
  resourceResolveData: {
    descriptionFileData: {
      name: 'app',
    },
  },
};

const resourceMajorLongRequest: NMFResult = {
  resourceResolveData: {
    descriptionFileData: {
      name: '@tinkoff/utils',
      version: '1.0.0',
    },
    relativePath: './is/array.js',
  },
};

const resourceMinorLongRequest: NMFResult = {
  resourceResolveData: {
    descriptionFileData: {
      name: '@tinkoff/utils',
      version: '0.1.0',
    },
    relativePath: './is/array.js',
  },
};

const resourcePatchLongRequest: NMFResult = {
  resourceResolveData: {
    descriptionFileData: {
      name: '@tinkoff/utils',
      version: '0.0.1',
    },
    relativePath: './is/array.js',
  },
};

describe('DedupePlugin', () => {
  describe('createCacheKeyFromNMFResult', () => {
    it('Возвращает null для ресурса без версии и названия', () => {
      expect(createCacheKeyFromNMFResult(resourceWithoutData)).toBe(null);
    });

    it('Возвращает null для ресурса без версии', () => {
      expect(createCacheKeyFromNMFResult(resourceWithoutVersion)).toBe(null);
    });

    it('Генерирует корректный ключ для ресурса с major версией', () => {
      expect(createCacheKeyFromNMFResult(resourceMajorLongRequest)).toBe(
        '@tinkoff/utils@1.0.0:./is/array.js'
      );
      expect(createCacheKeyFromNMFResult(resourceMajorLongRequest, true)).toBe(
        '@tinkoff/utils@1:./is/array.js'
      );
    });

    it('Генерирует корректный ключ для ресурса с minor версией', () => {
      expect(createCacheKeyFromNMFResult(resourceMinorLongRequest)).toBe(
        '@tinkoff/utils@0.1.0:./is/array.js'
      );
      expect(createCacheKeyFromNMFResult(resourceMinorLongRequest, true)).toBe(
        '@tinkoff/utils@0.1:./is/array.js'
      );
    });

    it('Генерирует корректный ключ для ресурса с patch версией', () => {
      expect(createCacheKeyFromNMFResult(resourcePatchLongRequest)).toBe(
        '@tinkoff/utils@0.0.1:./is/array.js'
      );
      expect(createCacheKeyFromNMFResult(resourcePatchLongRequest, true)).toBe(
        '@tinkoff/utils@0.0.1:./is/array.js'
      );
    });

    it('[bugfix] генерирует корректный ключ для ресурса с вложенной библиотекой, при пересечении названий', () => {
      expect(
        createCacheKeyFromNMFResult({
          resourceResolveData: {
            descriptionFileData: {
              name: 'bar',
              version: '1.0.0',
            },
            relativePath: './bar/index.js',
          },
        })
      ).toBe('bar@1.0.0:./bar/index.js');
    });
  });
});
