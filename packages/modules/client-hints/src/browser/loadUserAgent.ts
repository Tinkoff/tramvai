import type { UserAgent } from '@tinkoff/user-agent';
import { parseClientHintsUserAgentData, parse } from '@tinkoff/user-agent';

const getFromUserAgentData = (): UserAgent | null => {
  try {
    // @ts-expect-error. We are handling error here, that's why we can force TS
    const { brands, mobile, platform } = window.navigator.userAgentData;

    // chrome User-Agent emulation doesn't sync with `navigator.userAgentData`,
    // and `navigator.userAgentData` return incorrect object for Safari User-Agents instead of `undefined`
    // example of this problem with Playwright tests - https://github.com/microsoft/playwright/issues/14361
    if (brands && brands.length === 0 && platform === '') {
      return null;
    }

    return parseClientHintsUserAgentData({ brands, mobile, platform });
  } catch (error) {
    return null;
  }
};

export function loadUserAgent(): UserAgent {
  const fromUserAgentData = getFromUserAgentData();

  return fromUserAgentData ?? parse(navigator.userAgent);
}
