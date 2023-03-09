import Ajv from 'ajv';
import isObject from '@tinkoff/utils/is/object';
import isEmpty from '@tinkoff/utils/is/empty';
import clone from '@tinkoff/utils/clone';
import type { Config, SyncJsonFile } from '../typings/projectType';
import type { ConfigEntry } from '../typings/configEntry/common';
import { isOverridableOption } from '../typings/configEntry/common';
import { getTramvaiConfig } from '../utils/getTramvaiConfig';
import { merge } from '../utils/merge';
import { schema } from '../schema/tramvai';

export class ConfigManager {
  config: Config;

  syncConfigFile: SyncJsonFile;

  constructor({ config, syncConfigFile }: { config: Config; syncConfigFile: SyncJsonFile }) {
    this.config = config;
    this.syncConfigFile = syncConfigFile;

    this.validateConfig();
  }

  get() {
    return this.config;
  }

  set(config: Config) {
    this.config = merge(this.config, config);
  }

  getProject(projectName: string): ConfigEntry {
    const entry = this.config.projects[projectName];

    if (!entry) {
      console.error('This repo supports following projects: ', Object.keys(this.config.projects));
      throw new Error(`${projectName} not found in tramvai.json`);
    }

    return entry;
  }

  addProject(configEntry: ConfigEntry, name = configEntry.name): Promise<void> {
    if (this.config.projects[name]) {
      return Promise.reject(new Error(`Project ${name} also exist`));
    }
    const newConfig = merge(this.config, {
      projects: {
        [name]: configEntry,
      },
    });

    return this.updateConfig(newConfig);
  }

  private updateConfig(config: Config): Promise<void> {
    const { path } = getTramvaiConfig();

    return this.syncConfigFile({ path, newContent: config }).then(() => {
      this.set(config);
      this.validateConfig();
    });
  }

  private validateConfig() {
    if (!this.config) {
      return;
    }

    const { projectsConfig = {} } = this.get();
    // Ajv с параметром `useDefaults: true` мутирует объект валидации
    const configParameters = clone(this.get());

    // Поле projectsConfig не проходит валидацию, и дефолты не применяются, удаляем до валидации
    delete configParameters.projectsConfig;
    // Мержим projectsConfig в каждый projects до валидации, чтобы не применялись дефолты

    Object.keys(configParameters.projects).forEach((projectName) => {
      const entry = configParameters.projects[projectName];

      configParameters.projects[projectName] = merge(projectsConfig, entry);
    });

    const ajv = new Ajv({ useDefaults: true });

    ajv.addKeyword('cli_overridable', {
      modifying: true,
      errors: false,
      validate(schemaValue, currentValue, propSchema) {
        const defaultValue = (propSchema as any).default;

        if (!isObject(currentValue)) {
          return true;
        }

        let defaultDev = defaultValue;
        let defaultProd = defaultValue;

        if (isOverridableOption(defaultValue)) {
          defaultDev = defaultValue.development;
          defaultProd = defaultValue.production;
        }

        if (isOverridableOption(currentValue) || isEmpty(currentValue)) {
          if (!currentValue.development) {
            // eslint-disable-next-line no-param-reassign
            currentValue.development = defaultDev;
          }

          if (!currentValue.production) {
            // eslint-disable-next-line no-param-reassign
            currentValue.production = defaultProd;
          }
        }

        return true;
      },
    });

    const validate = ajv.compile(schema);
    const valid = validate(configParameters);

    // сохраняем обновленные параметры, в них были добавлены значения по умолчанию
    this.config = configParameters;

    if (!valid) {
      const errorsMessage = validate.errors
        .map((error) => {
          let message = ajv.errorsText([error]);

          if (error.message === 'should NOT have additional properties') {
            message += ` - remove or rename "${(error.params as any).additionalProperty}" property`;
          }

          return message;
        })
        .join('\n');

      throw new Error(`[validateConfig] Config validation failed. Check errors below and make appropriate changes.
If this errors appeared after updating tramvai dependencies make sure you use command "tramvai update" to make the update or consult the docs to see config changes for your version

${errorsMessage}
`);
    }
  }
}
