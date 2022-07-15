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

type Interface = ExtractTokenType<typeof CHILD_APP_RESOLUTION_CONFIG_MANAGER_TOKEN>;

export class ChildAppResolutionConfigManager implements Interface {
  private rawConfigs: ExtractDependencyType<typeof CHILD_APP_RESOLUTION_CONFIGS_TOKEN>;
  private mapping: Map<string, ChildAppResolutionConfig>;

  private hasInitialized = false;
  private initPromise: Promise<void>;
  constructor({
    configs,
  }: {
    configs: ExtractDependencyType<typeof CHILD_APP_RESOLUTION_CONFIGS_TOKEN> | null;
  }) {
    this.rawConfigs = configs ?? [];
    this.mapping = new Map();
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
          return applyOrReturn([], rawConfig);
        })
      );
      flatten<ChildAppResolutionConfig>(configs).forEach((config) => {
        this.mapping.set(config.name, config);
      });

      this.hasInitialized = true;
    })();

    return this.initPromise;
  }

  resolve({ name, version, tag = 'latest' }: ChildAppRequestConfig): ResolutionConfig {
    const fromMapping = this.mapping.get(name);

    if (!fromMapping) {
      return null;
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
