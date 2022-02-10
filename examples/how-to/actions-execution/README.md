# Executing actions on different pages

Each action can be made global by linking to specific pages, bundles, or the application itself; this mechanism is described in detail on the [Action](concepts/action.md) page. Such actions will be executed automatically.

### Binding actions to a specific page

To do this, you can use the static property `actions` of page components:

<p>
<details>
<summary>Creating actions</summary>

@inline actions/page.ts

</details>
</p>

<p>
<details>
<summary>Connecting actions to the page</summary>

@inline components/Page.tsx

</details>
</p>

### Binding actions to a bundle

[Bundles](concepts/bundle.md) allow you to group pages, you can bind actions to them, which will be executed for each page of the bundle:

<p>
<details>
<summary>Creating actions</summary>

@inline actions/bundle.ts

</details>
</p>

<p>
<details>
<summary>Connecting actions to the bundle</summary>

@inline bundles/mainDefault.ts

</details>
</p>

## Common actions for the application

Actions connected to [application](references/tramvai/core.md#createApp) are executed on all pages:

<p>
<details>
<summary>Creating actions</summary>

@inline actions/global.ts

</details>
</p>

<p>
<details>
<summary>Connecting actions into the application</summary>

@inline index.ts

</details>
</p>
