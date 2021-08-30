# Выполнение экшенов на отдельных страницах

Каждый экшен можно сделать глобальным, привязав к конкретным страницам, бандлам, или самому приложению, этот механизм подробно описан на странице [Экшен](concepts/action.md). Такие экшены будут выполнены автоматически.

### Привязка экшенов к конкретной странице

Для этого можно использовать статичесикое свойство `actions` у компонентов - страниц:

<p>
<details>
<summary>Создаем экшены</summary>

@inline actions/page.ts

</details>
</p>

<p>
<details>
<summary>Подключаем их на страницу</summary>

@inline components/Page.tsx

</details>
</p>

### Привязка экшенов к бандлу

[Бандлы](concepts/bundle.md) позволяют группировать страницы, к ним можно привязать экшены, которые будут выполняться для каждой страницы бандла:

<p>
<details>
<summary>Создаем экшены</summary>

@inline actions/bundle.ts

</details>
</p>

<p>
<details>
<summary>Подключаем их к бандлу</summary>

@inline bundles/mainDefault.ts

</details>
</p>

## Общие экшены для приложения

Экшены, подключенные к [приложению](references/tramvai/create-app.md), выполняются на всех страницах:

<p>
<details>
<summary>Создаем экшены</summary>

@inline actions/global.ts

</details>
</p>

<p>
<details>
<summary>Подключаем их к приложению</summary>

@inline index.ts

</details>
</p>
