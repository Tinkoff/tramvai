import { CLIEngine } from 'eslint';
import path from 'path';
import sortBy from '@tinkoff/utils/array/sortBy';
import prop from '@tinkoff/utils/object/prop';

export const runLintWithFixtures = (type: string, eslintConfig: Record<string, any>) => {
  const cli = new CLIEngine({
    ignore: false,
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    useEslintrc: false,
    cwd: path.join(__dirname, '..', '..', '..', '..'),
    baseConfig: {
      ...eslintConfig,
    },
  });
  const targetDir = path.resolve(__dirname, '..', '__fixtures__', type);
  const lintResult = cli.executeOnFiles([targetDir]);

  return lintResult.results.reduce((results, { filePath, messages }) => {
    const sortedMessages = sortBy(prop('ruleId'), messages);

    // strip path
    const fileName = path.basename(filePath);
    return Object.assign(results, {
      [fileName]: sortedMessages.reduce((acc, { severity, ruleId }) => {
        const resultPerFile: any = acc;
        switch (severity) {
          // warning
          case 1:
            if (typeof resultPerFile.warnings === 'undefined') {
              resultPerFile.warnings = [];
            }
            resultPerFile.warnings.push(ruleId);
            break;
          // errors
          case 2:
            if (typeof resultPerFile.errors === 'undefined') {
              resultPerFile.errors = [];
            }
            resultPerFile.errors.push(ruleId);
            break;
          default:
            throw new Error(`Got an unknown severity: ${severity}(${ruleId})`);
        }
        return resultPerFile;
      }, {}),
    });
  }, {});
};
