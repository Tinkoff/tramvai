# @tramvai/types-actions-state-context

В этой библиотеке объединены типы для `@tramvai/core` и `@tramvai/state`.

Объединение решает проблему циклической зависимости между `@tramvai/core` и `@tramvai/state`,
т.к. интерфейсы `Action` и `ConsumerContext` зависят друго от друга.

Только для внутреннего использования!
