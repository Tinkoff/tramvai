import type { UAParser } from 'ua-parser-js';

type ParserResult = ReturnType<UAParser['getResult']>;

export interface UserAgent extends Omit<ParserResult, 'ua'> {
  browser: ParserResult['browser'] & { browserEngine: string };
  mobileOS?: string;
  sameSiteNoneCompatible: boolean;
}

export type { UAParser };
