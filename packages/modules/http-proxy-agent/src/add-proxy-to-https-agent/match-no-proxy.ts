const RULES_SEPARATOR = ',';
const HOST_PORT_SEPARATOR = ':';
const DOMAIN_SEPARATOR = '.';
const WILDCARD = '*';

/**
 * Support specification proposal from https://about.gitlab.com/blog/2021/01/27/we-need-to-talk-no-proxy/#the-lowest-common-denominator
 */
export const matchNoProxy = ({
  noProxy,
  hostname,
}: {
  noProxy: string;
  hostname: string;
}): boolean => {
  const rules = noProxy.split(RULES_SEPARATOR).filter(Boolean);

  for (const rule of rules) {
    // @todo: respect port when matching
    const [ruleHost, _rulePort] = rule.split(HOST_PORT_SEPARATOR);

    // Wildcard (*) match all hosts
    if (ruleHost === WILDCARD) {
      return true;
    }

    // Strip leading dots (.) and wildcard with dot (*.) for backward compatibility
    const ruleHostWithoutLeadingDot = ruleHost.replace(/^\*?\./, '');
    const matchRegex = new RegExp(`${ruleHostWithoutLeadingDot}$`);

    /**
     * @example
     * 'localhost'.match(/localhost$/)
     * 'api.test.com'.match(/test.com$/)
     */
    if (hostname.match(matchRegex)) {
      return true;
    }
  }

  return false;
};
