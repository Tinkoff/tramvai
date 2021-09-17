// хотелось бы сделать в таком виде https://github.com/browserslist/browserslist#configuring-for-different-environments
// т.е. разные конфиги для разных env
// но browserslist пока такое не поддерживает для пакетов-конфигураций
// https://github.com/browserslist/browserslist/issues/300

const defaults = [
  // desktop
  'Chrome >= 30',
  'Safari >= 10',
  'Firefox >= 40',
  'Opera >= 44',
  'Edge >= 16',
  // mobile
  'ChromeAndroid >= 30',
  'ios_saf >= 10',
  'Android >= 5',
  'OperaMobile >= 47',
  'UCAndroid >= 12',
  'FirefoxAndroid >= 40',
];

const modern = [
  // desktop
  'Chrome >= 61',
  // https://bugs.webkit.org/show_bug.cgi?id=171041
  'Safari >= 12',
  'Firefox >= 60',
  'Opera >= 48',
  // 16 version force babel to transpile spread in object literals to Object.assing
  // this version is quite old, but if we update it to Chromium based version,
  // we will have spread in modern bundles, and see many Syntax Errors in logs
  'Edge >= 16',
  'Samsung >= 8.2',
  // mobile
  'ChromeAndroid >= 61',
  // https://bugs.webkit.org/show_bug.cgi?id=171041
  'ios_saf >= 12',
  'OperaMobile >= 48',
  'FirefoxAndroid >= 60',
];

const node = ['Node >= 12'];

module.exports = {
  defaults,
  legacy: defaults,
  modern,
  node,
};
