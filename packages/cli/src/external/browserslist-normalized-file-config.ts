/**
 * @description
 * Внешний конфиг для browserslist который может храниться в файле .browserslistrc или в package.json приложения
 * вместо оригинального конфига возвращается преобразованная версия, которая не содержит extends т.к. extends требует
 * динамические импорты, которые не будут работать после сборки webpack
 */
export default {} as Record<string, string[]>;
