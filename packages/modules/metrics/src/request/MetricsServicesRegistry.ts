import type { MetricsServicesRegistryInterface } from '@tramvai/tokens-metrics';
import isString from '@tinkoff/utils/is/string';
import { PrefixTree } from './PrefixTree';

const NO_PROTOCOL = 'NO PROTOCOL';
const PROTOCOL_REGEX = /^([a-z0-9.+-]+:)/i;

const splitProtocolAndUrl = (url) => {
  // Регулярка используется потому что протокол обязателен и класс URL не распарсит такую строку
  const urlMatches = url.match(PROTOCOL_REGEX);
  const protocol = urlMatches && urlMatches[0];

  // Под + 2 тут подразумевается два слеша после протокола например для http: обрежется http://
  const urlWOProtocol = protocol ? url.slice(protocol.length + 2) : url;

  return [protocol, urlWOProtocol];
};

class MetricsServicesRegistry implements MetricsServicesRegistryInterface {
  private registryPrefixTree: PrefixTree<Record<string, string>> = new PrefixTree({
    delimiter: '/',
  });

  registerEnv(env) {
    Object.keys(env).forEach((name) => {
      // В env могут быть undefined, и number, т.к. это явно не урлы, просто пропускаем
      if (isString(env[name])) {
        this.register(env[name], name);
      }
    });
  }

  register(url, serviceName) {
    if (!url) {
      return;
    }

    const [protocol, urlWOProtocol] = splitProtocolAndUrl(url);
    // Некоторые модули не хранят инфу о протоколе, потому что tinkoff-request сам подставляет протокол.
    // В результате при поиске префиксное дерево не отрабатывает.
    // предусматриваем этот случай добавляя инфу о том для какого протокола храним имя сервиса.
    this.registryPrefixTree.set(urlWOProtocol, (value) => ({
      ...(value || {}),
      [protocol || NO_PROTOCOL]: serviceName,
    }));
  }

  getServiceName(url) {
    if (!url) {
      return undefined;
    }

    const [protocol, urlWOProtocol] = splitProtocolAndUrl(url);

    const treeValue = this.registryPrefixTree.get(urlWOProtocol);

    if (!treeValue) {
      return undefined;
    }
    // Когда урл запросен из регистри, мы не знаем был ли он добавлен с протоколом, поэтому
    // проверяем оба варианта
    return treeValue[protocol] || treeValue[NO_PROTOCOL];
  }
}

export { MetricsServicesRegistry };
