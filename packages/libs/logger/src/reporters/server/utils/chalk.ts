import chalk from 'chalk';

const colorCache = {};

export function chalkColor(name) {
  let color = colorCache[name];
  if (color) {
    return color;
  }

  if (name[0] === '#') {
    color = chalk.hex(name);
  } else {
    color = chalk[name] || chalk.keyword(name);
  }

  colorCache[name] = color;
  return color;
}

const bgColorCache = {};

export function chalkBgColor(name) {
  let color = bgColorCache[name];
  if (color) {
    return color;
  }

  if (name[0] === '#') {
    color = chalk.bgHex(name);
  } else {
    color = chalk[`bg${name[0].toUpperCase()}${name.slice(1)}`] || chalk.bgKeyword(name);
  }

  bgColorCache[name] = color;
  return color;
}
