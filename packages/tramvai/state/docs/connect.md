# Connect

Обновленная версия connect основанная на реализации из [react-redux](https://github.com/reactjs/react-redux/tree/a5e45d9806492d0fe1354437111722cf15b17b4d/src).
Предыдущую версию можно найти в `../connectOld.js`

Дока для версии react-redux [тут](https://github.com/reactjs/react-redux/blob/a5e45d9806492d0fe1354437111722cf15b17b4d/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
Но есть важные отличия в реализации (из-за архитектурных отличий от redux и для совместимости со старой версией connect):

1. Отличия в работе connectAdvanced:
    * добавлена опция stores со списком сторов для подписки
    * работа со сторами осуществляется исключительно через Subscription
    * убрана логика с использованием React.Context и заменена на работу с платформенным контекстом
    * добавлена опция debug для добавления пропсов __renderCount__ и __subscription__
    * из старой реализации перенесена логика с опциями hoistingProperties и hoistPropertiesOnlyOnce для поднятия свойств оборачиваемого компонента в обертку
1. Сильно изменена логика работы Subscription:
    * изменен способ подписки согласно ахитектуре платформы
    * убрана ненужная логика с вложенными подписками
    * теперь подписка хранит стейты всех сторов на которые подписана
1. mapDispatchToProps изменен на mapContextToProps и принимает context первым параметром (если параметр опущен, то по умолчанию mapContextToProps возвращает пустой объект)
1. для mapStateToProps теперь дефолтное поведение это вернуть весь стейт подписки, а не пустой объект
1. внутри SelectorFactory mapStateToProps и mapContextToProps теперь вторым параметром принимают не просто ownProps, а смерженые пропсы с дефолтными значениями для компонента ({...WrappedComponent.defaultProps, ...ownProps}).
Также в деве включена проверка, чтобы mapStateToProps на вызовы с одинаковыми параметрами возвращала shallowEqual значения
1. в index.js теперь принимает первым параметром сторы для пописки и изменена проверка shouldHandleStateChanges для проверки надо ли создавать подписку - теперь подписка создается если переданы какие-то сторы (в react-redux если задан mapStateToProps)

