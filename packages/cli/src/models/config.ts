import Ajv from 'ajv';
import clone from '@tinkoff/utils/clone';
import type { Config, SyncJsonFile } from '../typings/projectType';
import type { ConfigEntry } from '../typings/configEntry/common';
import { getTramvaiConfig } from '../utils/getTramvaiConfig';
import { merge } from '../utils/merge';
import { schema } from '../schema/tramvai';

export class ConfigManager {
  private readonly defaultConfigFileName = 'platform.json';

  config: Config;

  syncConfigFile: SyncJsonFile;

  constructor({ config, syncConfigFile }) {
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
      console.error('This repo support projects: ', Object.keys(this.config.projects));
      throw new Error(`${projectName} not found in platform.json`);
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
    const { path, configName: configFileName = this.defaultConfigFileName } = getTramvaiConfig();

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

      configParameters.projects[projectName] = merge(
        projectsConfig,
        projectsConfig[entry.type],
        entry
      );
    });

    const ajv = new Ajv({ useDefaults: true });
    const validate = ajv.compile(schema);
    const valid = validate(configParameters);

    // сохраняем обновленные параметры, в них были добавлены значения по умолчанию
    this.set(configParameters);

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

      throw new Error(`[validateConfig] ${errorsMessage}`);
    }
  }
}
