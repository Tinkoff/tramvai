import applyOrReturn from '@tinkoff/utils/function/applyOrReturn';
import flatten from '@tinkoff/utils/array/flatten';
import type {
  ChildAppRequestConfig,
  ChildAppResolutionConfig,
  CHILD_APP_RESOLUTION_CONFIGS_TOKEN,
  CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN,
  ResolutionConfig,
} from '@tramvai/tokens-child-app';
import type { ExtractDependencyType, ExtractTokenType } from '@tinkoff/dippy';
import type { LOGGER_TOKEN } from '@tramvai/tokens-common';

type Interface = ExtractTokenType<typeof CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN>;

export class ChildAppResolutionConfigManager implements Interface {
  private rawConfigs: ExtractDependencyType<typeof CHILD_APP_RESOLUTION_CONFIGS_TOKEN>;
  private mapping: Map<string, ChildAppResolutionConfig>;
  private log: ReturnType<typeof LOGGER_TOKEN>;

  private hasInitialized = false;
  private initPromise?: Promise<void>;
  constructor({
    configs,
    logger,
  }: {
    configs: ExtractDependencyType<typeof CHILD_APP_RESOLUTION_CONFIGS_TOKEN> | null;
    logger: typeof LOGGER_TOKEN;
  }) {
    this.rawConfigs = configs ?? [];
    this.mapping = new Map();
    this.log = logger('child-app:resolution-config');
  }

  async init() {
    if (this.hasInitialized) {
      return;
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      const configs = await Promise.all(
        this.rawConfigs.map((rawConfig) => {
          return Promise.resolve()
            .then(() => {
              return applyOrReturn([], rawConfig);
            })
            .catch((error) => {
              this.log.error(error, 'Failed while resolving resolution config');
            });
        })
      );
      flatten<ChildAppResolutionConfig>(configs).forEach((config) => {
        if (config) {
          this.mapping.set(config.name, config);
        }
      });

      this.hasInitialized = true;
    })();

    return this.initPromise;
  }

  resolve({ name, version, tag = 'latest' }: ChildAppRequestConfig): ResolutionConfig | undefined {
    const fromMapping = this.mapping.get(name);

    if (!fromMapping) {
      return;
    }

    const cfg = fromMapping.byTag[tag];

    if (process.env.NODE_ENV === 'development' && tag === 'debug' && !cfg) {
      return {
        baseUrl: 'http://localhost:4040/',
        version: '0.0.0-stub',
      };
    }

    return {
      ...cfg,
      baseUrl: cfg.baseUrl ?? fromMapping.baseUrl,
      version: version ?? cfg.version,
    };
  }
}
