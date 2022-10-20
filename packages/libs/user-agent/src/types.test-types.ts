import { expectTypeOf } from 'expect-type';
import type { UAParser } from 'ua-parser-js';
import type { UserAgent } from './types';

type ParserResult = ReturnType<UAParser['getResult']>;

interface PreviousUserAgent extends Omit<ParserResult, 'ua'> {
  browser: ParserResult['browser'] & { browserEngine: string };
  mobileOS?: string;
  sameSiteNoneCompatible: boolean;
}

expectTypeOf<UserAgent>().toEqualTypeOf<PreviousUserAgent>();
