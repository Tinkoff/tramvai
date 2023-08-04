import type { UserAgent } from '@tinkoff/user-agent';
import { parseClientHintsUserAgentData, parse } from '@tinkoff/user-agent';

const getFromUserAgentData = (): UserAgent | null => {
  try {
    // @ts-expect-error. We are handling error here, that's why we can force TS
    const { brands, mobile, platform } = window.navigator.userAgentData;

    return parseClientHintsUserAgentData({ brands, mobile, platform });
  } catch (error) {
    return null;
  }
};

export function loadUserAgent(): UserAgent {
  const fromUserAgentData = getFromUserAgentData();

  return fromUserAgentData ?? parse(navigator.userAgent);
}
