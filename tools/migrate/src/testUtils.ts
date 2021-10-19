import { createJsCodeShiftApi } from './api';
import type { Api, Transformer, PathTransformer, SourceFileInfo } from './types';
import { PRINT_OPTIONS } from './constants';

type TransformInterface = {
  transformer: Transformer;
  pathTransformer: PathTransformer;
};

export const createApi = ({
  tramvaiJSON = {
    source: {},
    path: '/',
  },
  packageJSON = {
    source: {},
    path: '/',
  },
  transformTests = {},
}: {
  tramvaiJSON?: {
    source: Record<string, any>;
    path?: string;
  };
  packageJSON?: {
    source: Record<string, any>;
    path?: string;
  };
  transformTests?: Record<
    string,
    {
      input: {
        source: string;
        path?: string;
      };
      output?: {
        source?: string;
        path?: string;
      };
      snapshot?: boolean;
    }
  >;
}): Api => {
  const jsCodeShiftApi = createJsCodeShiftApi();

  let resolveWaitTransformers: (transformers: TransformInterface) => void;
  const waitForTransformers: Promise<TransformInterface> = new Promise((resolve) => {
    resolveWaitTransformers = resolve;
  });

  describe('transform', () => {
    for (const testName in transformTests) {
      it(testName, async () => {
        const { transformer, pathTransformer } = await waitForTransformers;
        const test = transformTests[testName];

        const fileInfo: SourceFileInfo = {
          source: test.input.source,
          originSource: test.input.source,
          path: test.input.path,
          originPath: test.input.path,
        };

        const output = {
          source: transformer(fileInfo, jsCodeShiftApi, { printOptions: PRINT_OPTIONS }),
          path: pathTransformer?.(fileInfo),
        };

        if (test.snapshot) {
          expect(output.source).toMatchSnapshot();

          if (test.input.path) {
            expect(output.path).toMatchSnapshot();
          }
        } else {
          expect(output.source).toBe(test?.output?.source);

          if (test.input.path) {
            expect(output.path).toBe(test?.output?.path);
          }
        }
      });
    }
  });

  return {
    packageJSON: packageJSON as any,
    tramvaiJSON: tramvaiJSON as any,
    transform: async (transformer, pathTransformer) => {
      resolveWaitTransformers({
        transformer,
        pathTransformer,
      });
    },
  };
};
