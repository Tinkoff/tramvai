# Redux devtools

Для включения devtools необходимо выполнить:

- Установить расширение в браузере: [расширение для Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) или [расширение для FireFox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)
- Открыть страницу на `tramvai` и открыть расширение кликом на иконку Redux devtools

![Redux devtools](https://cloud.githubusercontent.com/assets/7957859/18002950/aacb82fc-6b93-11e6-9ae9-609862c18302.png)

### Возможные проблемы

1. Для лучшего пользовательского опыта необходимо использовать отдельное окно расширения redux dev tools, а не вкладку в chrome developer tools, т.к. иначе не сохраняется история экшнов [issue](https://github.com/zalmoxisus/redux-devtools-extension/issues/505).

### Производительность

Так как весь стейт приложения со всеми экшенами довольно большой, то наблюдаются ощутимые тормоза при работе с девтулз при использовании прыжков по состояниям\событиям и при одновременном срабатывании большого количества экшнов. Поэтому:

1. Используйте техники кастомизации для задания pickState для уменьшения размера данных в девтулзах.
1. Увеличьте значение параметра latency (передается в connectViaExtension.connect), который по сути делает debounce на посылку actions в расширение [docs](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#latency)

### Дополнительный материал

- [Репозиторий с devtools](https://github.com/zalmoxisus/redux-devtools-extension)
- [Getting Started with Redux DevTools Extension ](https://egghead.io/lessons/javascript-getting-started-with-redux-dev-tools)
