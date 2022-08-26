import sizeOf from 'image-size';

/**
 * Reuse file-loader logic, but return a object with src and size of image
 */
export default function (content) {
  const result = require('file-loader').call(this, content);

  const dimensions = sizeOf(this.resourcePath);

  // @todo: image blur placeholder in Base64, sharp or imagemin or jimp?
  return result.replace(
    /^export default (__webpack_public_path__ \+ .+);$/,
    `const path = $1;

export default path;

export const image = {
  src: $1,
  width: ${JSON.stringify(dimensions.width)},
  height: ${JSON.stringify(dimensions.height)},
};`
  );
}

export const raw = true;
