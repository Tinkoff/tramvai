import type { ConfigManager } from '../config/configManager';
import type { ApplicationConfigEntry } from '../typings/configEntry/application';
import type { ModuleConfigEntry } from '../typings/configEntry/module';

const appConfig = {} as ConfigManager<ApplicationConfigEntry>;
const moduleConfig = {} as ConfigManager<ModuleConfigEntry>;

export { appConfig, moduleConfig };
export default appConfig;
