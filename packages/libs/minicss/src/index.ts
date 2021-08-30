import { interpolateName } from 'loader-utils';
import generateCssName from 'css-class-generator';
import cssesc from 'cssesc';

interface Options {
  baseName?: string;
  baseInterpolateName?: string;
}

export const createGenerator = ({
  baseName = '',
  baseInterpolateName = '[hash:base64:5]',
}: Options = {}) => {
  const files = {};

  return (context, localIdentName, localName, options) => {
    if (!/\[minicss]/.test(localIdentName)) {
      // эмулируем поведение css-loader по умолчанию https://github.com/webpack-contrib/css-loader/blob/master/src/utils.js#L49
      // TODO: можно будет вернуть просто null чтобы сработала логика по умолчанию, но еще не зарелижено
      // https://github.com/webpack-contrib/css-loader/blob/master/src/utils.js#L310
      return cssesc(
        interpolateName(context, localIdentName, options).replace('[local]', localName),
        { isIdentifier: true }
      );
    }

    const { resourcePath } = context;

    // check file data at cache by absolute path
    let fileShort = files[resourcePath];

    // no file data, lets generate and save
    if (!fileShort) {
      // if we know file position, we must use base52 encoding with '_'
      // between rule position and file position
      // to avoid collapse hash combination. a_ab vs aa_b
      const fileShortName = interpolateName(context, baseInterpolateName, {
        content: `${baseName}${resourcePath}`,
      });

      fileShort = { name: fileShortName, lastUsed: -1, ruleNames: {} };
      files[resourcePath] = fileShort;
    }

    // Get generative rule name from this file
    let newRuleName = fileShort.ruleNames[localName];

    // If no rule - renerate new, and save
    if (!newRuleName) {
      // Count +1
      fileShort.lastUsed += 1;

      // Generate new rule name
      newRuleName = `${generateCssName(fileShort.lastUsed)}${fileShort.name}`;

      // Saved
      fileShort.ruleNames[localName] = newRuleName;
    }

    // TODO: cssesc можно будет убрать, когда в css-loader зарелизят
    // escaping для кастомного генератора
    // https://github.com/webpack-contrib/css-loader/blob/master/src/utils.js#L322
    return cssesc(
      interpolateName(
        context,
        localIdentName.replace('[local]', localName).replace('[minicss]', newRuleName),
        {
          content: localName,
        }
      ),
      { isIdentifier: true }
    );
  };
};

export default createGenerator;
