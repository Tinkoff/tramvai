import type { ReactElement, ComponentType } from 'react';
import { createToken } from '@tinkoff/dippy';
import { StorageRecord } from '@tinkoff/htmlpagebuilder';
import * as ResourceSlot from './slots';

/**
 * @description
 * Позволяет добавлять ресурсы в определенные слоты при рендере приложения.
 * Используется только на сервере, эквивалентно использованию RESOURCES_REGISTRY.
 *
 * [Пример использования](https://tramvai.dev/docs/how-to/render-add-resources)
 */
export const RENDER_SLOTS = createToken<PageResource | PageResource[]>('RENDER_SLOTS', {
  multi: true,
});

/**
 * @description
 * Позволяет переопределять атрибуты для html, body и контейнера приложения. Имейте в виду, что:
    - это именно html атрибуты, а не реакт (т.е. должен быть не className, а class).
    - новые атрибуты затирают старые
    - поддерживаются только текстовые значения
 *
 * @example
  ```tsx
  {
    provide: HTML_ATTRS,
    useValue: {
      target: 'body',
      attrs: {
        class: 'custom-class',
      },
    },
    multi: true,
  },
  ```
 */
export const HTML_ATTRS = createToken<HtmlAttrs>('HTML_ATTRS', { multi: true });

/**
 * @description
 * Позволяет повесить Node-style колбэк на событие рендеринга в браузере.
 * Первым аргументом отправляет ошибку, если таковая имелась
 */
export const RENDERER_CALLBACK = createToken<((e?: Error) => void)[]>('RENDERER_CALLBACK', {
  multi: true,
});

/**
 * @description
 * Позволяет задать функцию-обертку для рендера и переопределить параметры или результат рендера
 */
export const CUSTOM_RENDER = createToken('CUSTOM_RENDER');

/**
 * @description
 * Регистр ресурсов - используется на сервере для регистрации дополнительных ресурсов (скриптов, стилей, верстки) которые должны быть вставлены в итоговую html-страницу
 */
export const RESOURCES_REGISTRY = createToken<ResourcesRegistry>('resourcesRegistry');

/**
 * @description
 * Строка отвечающая за проверку требуется ли загрузить файл полифиллов в конкретном браузере.
 * Полифиллы грузятся всегда для браузеров без поддержки модулей, а в браузерах с поддержкой будет выполняться данная проверка
 * (по умолчанию проверяет на Promise.prototype.finally и реализацию URL, URLSearchParams)
 *
 * [Документация по полифилам](https://tramvai.dev/docs/how-to/how-to-enable-polyfills)
 */
export const POLYFILL_CONDITION = createToken<string>('POLYFILL_CONDITION');

/**
 * @description
 * Позволяет включить разные режимы работы React приложения - `strict`, `blocking`, `concurrent`, по умолчанию используется `legacy` - обычный режим работы
 *
 * [Подробнее в документации к module-render](https://tramvai.dev/docs/references/modules/render)
 */
export const RENDER_MODE = createToken<RenderMode>('RENDER_MODE');

/**
 * @description
 * Позволяет сделать обертку для текущего провайдера.
 * Позволяет добавлять, например, свои React.Context.Provider для разного функционала
 */
export const EXTEND_RENDER = createToken<Array<(current: ReactElement) => ReactElement>>(
  'EXTEND_RENDER',
  {
    multi: true,
  }
);

/**
 * @description
 * Токен инициализации лайаута по умолчанию для страниц
 */
export const DEFAULT_LAYOUT_COMPONENT = createToken('defaultLayoutComponent');

/**
 * @description
 * Токен инициализации шапки по умолчанию для страниц
 */
export const DEFAULT_HEADER_COMPONENT = createToken('defaultHeaderComponent');

/**
 * @description
 * Токен инициализации футера по умолчанию для страниц
 */
export const DEFAULT_FOOTER_COMPONENT = createToken('defaultFooterComponent');

/**
 * @description
 * Токен для кастомизации дефолтного лейаута страниц
 */
export const LAYOUT_OPTIONS = createToken<LayoutOptions[]>('layoutOptions', { multi: true });

type ReactComponent = ComponentType<any>;

type Wrapper = (WrappedComponent: ReactComponent) => ReactComponent;

export interface LayoutOptions {
  components?: Record<string, ReactComponent>;
  wrappers?: Record<string, Wrapper | Wrapper[]>;
}

export interface PageResource {
  type: keyof typeof StorageRecord;
  slot: typeof ResourceSlot[keyof typeof ResourceSlot];
  payload: string | null;
  attrs?: Record<string, string | null>;
}

export interface ResourcesRegistry {
  register(resource: PageResource | PageResource[]): void;
  getPageResources(): PageResource[];
}

export type HtmlAttrs = {
  target: 'html' | 'body' | 'app';
  attrs: { [name: string]: string | boolean | Record<string, any> | number };
};

export type RenderMode = 'legacy' | 'strict' | 'blocking' | 'concurrent';

type ResourceInlineOptions = {
  threshold: number;
  types: (keyof typeof StorageRecord)[];
};

/**
 * @description
 * Настройки инлайнинга ресурсов в HTML-страницу
 * * threshold Максимальное значение (в байтах) размера файла, до которого он инлайнится в HTML-страницу
 * * types Типы ресурсов, которые нужно инлайнить
 */
export const RESOURCE_INLINE_OPTIONS = createToken<ResourceInlineOptions>(
  'resourceInlineThreshold'
);

export { ResourceSlot };
export { StorageRecord as ResourceType };
