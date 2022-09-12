// возникает когда в либе require используется как выражение или сохраняется в переменной
// в большинстве случаев ворнинг возникает на код вида:
// const nodeRequire = typeof __non_webpack_require__ === 'undefined' ? require : __non_webpack_require__;
export const REQUIRE_EXPRESSION =
  /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/;

// возкникает когда невозможно статически проанализировать выражение, переданное в require и определить
// какой код надо добавить в бандл
// возникает в node-библиотеках, завязанных на динамическую природу commonjs
export const REQUEST_DYNAMIC = /Critical dependency: the request of a dependency is an expression/;

// Отключает ворнинги для зависимостей, require которых обёрнут в try-catch. Обычно это нормально поведение и нет повода отвлекаться на ворнинг
export const MODULE_NOT_FOUND = /Module not found: Error: Can't resolve /;

export const ignoreWarnings = [
  { message: REQUIRE_EXPRESSION },
  { message: REQUEST_DYNAMIC },
  { message: MODULE_NOT_FOUND },
];
