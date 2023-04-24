import find from '@tinkoff/utils/array/find';
import { addLink } from './addLink';
import { addScript } from './addScript';
import type { LoadModuleOptions } from './types.h';

const normalizeUrl = (url: string) => url?.replace(/^https?:/, '');

const findLoadingScript = (url: string) =>
  find((script) => !!script.src && normalizeUrl(script.src) === url, document.scripts);

const findLoadingStyle = (url: string) =>
  find((style) => !!style.href && normalizeUrl(style.href) === url, document.styleSheets);

// если найден тег link с url в атрибуте data-href,
// это означает что стили были загружены inline, и не нужно грузить файл стилей повторно
const findLazyLoadingStyle = (url: string) => document.querySelector(`[data-href="${url}"]`);

// подразумевается что модуль уже может быть поставлен на загрузку во время ssr
// при этом загрузчик добавил onload/onerror хандлеры, которые проставляют атрибут loaded
export function loadModule(jsUrl: string, options: LoadModuleOptions = {}): Promise<unknown> {
  const script = findLoadingScript(jsUrl); // check if we loading script right now, preserves double loading

  if (script) {
    const loadedAttr = script.getAttribute('loaded');
    if (loadedAttr) {
      return loadedAttr === 'true' ? Promise.resolve() : Promise.reject();
    }

    return new Promise((resolve, reject) => {
      script.addEventListener('load', resolve);
      script.addEventListener('error', reject);
    });
  }

  const addHandlers = (scriptElement: HTMLScriptElement) => {
    scriptElement.addEventListener('load', () => scriptElement.setAttribute('loaded', 'true'));
    scriptElement.addEventListener('error', () => scriptElement.setAttribute('loaded', 'error'));
  };

  return Promise.all([
    addScript(jsUrl, { crossOrigin: 'anonymous' }, addHandlers),
    options.cssUrl && !findLoadingStyle(options.cssUrl) && !findLazyLoadingStyle(options.cssUrl)
      ? addLink('stylesheet', options.cssUrl, {}, { resolveOnFailed: options.resolveOnCssFailed })
      : Promise.resolve(),
  ]);
}
