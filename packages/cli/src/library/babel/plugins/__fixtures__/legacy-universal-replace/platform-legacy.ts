import asyncUniversal, {asyncUniversalPack} from '@tinkoff/platform-legacy/utils/decorators/asyncUniversal';

asyncUniversal(import('./cmp'))

export const packed = asyncUniversalPack({});
