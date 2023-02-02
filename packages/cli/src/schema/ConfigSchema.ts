import type { ModuleConfigEntry } from '../typings/configEntry/module';
import type { ApplicationConfigEntry } from '../typings/configEntry/application';
import type { PackageConfigEntry } from '../typings/configEntry/package';
import type { ChildAppConfigEntry } from '../typings/configEntry/child-app';
import type { ConfigEntry, OverridableOption } from '../typings/configEntry/common';

type ConvertOptionsToSchema<T> = T extends OverridableOption<infer U>
  ? { development?: U; production?: U } | U
  : T extends Record<string, any>
  ? {
      [key in keyof T]?: ConvertOptionsToSchema<T[key]>;
    }
  : T;

export type ConvertToSchema<T extends ConfigEntry> = ConfigEntry & ConvertOptionsToSchema<T>;

/**
 * Исходный интерфейс для генерации JSON Schema файла конфигурации.
 *
 * Здесь должен был быть описан весь интерфейс конфига, включая поле `projects,
 * но `typescript-json-schema` из интерфейсов вида `projects: { [key: string]: ApplicationConfigEntry | ModuleConfigEntry }`
 * генерирует compound ветку с ключевым словом `anyOf`.
 * Ajv не поддерживает применение default значений к compound веткам схемы https://github.com/ajv-validator/ajv#assigning-defaults,
 * поэтому генерируем параллельно конфиги для разных типов приложений,
 * которые можно использовать как угодно, в том числе внутри conditional веток с ключевыми словами `if`, `then`, `else`
 */
export type ConfigSchema = {
  application: ConvertToSchema<ApplicationConfigEntry>;
  module: ConvertToSchema<ModuleConfigEntry>;
  'child-app': ConvertToSchema<ChildAppConfigEntry>;
  package: ConvertToSchema<PackageConfigEntry>;
};
