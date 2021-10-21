# Execution of actions depending on conditions

For each action, you can specify the execution conditions, this mechanism is described in detail on the [Action page](concepts/action.md). By default, a global action is executed once on the server for each user request, if the action does not have time to complete within a certain time, then its execution is transferred to the client.

### Using preset limits

Let's say we want to execute one action only on the server, and one only on the client, for this there are `onlyServer` and `onlyBrowser` restrictions:

<p>
<details>
<summary>Create actions</summary>

@inline actions/inner.ts

</details>
</p>

<p>
<details>
<summary>Use actions</summary>

@inline actions/page.ts

</details>
</p>

### Create your own restrictions

To do this, you need to implement the `ActionCondition` interface, and add a new limiter to the DI, via the `ACTION_CONDITIONALS` token:

<p>
<details>
<summary>Create a delimiter</summary>

@inline conditions/custom.ts

</details>
</p>

<p>
<details>
<summary>Create an action with this constraint</summary>

@inline actions/custom.ts

</details>
</p>

### Execute actions on specific pages only

To do this, we use the static property `actions` for the component that is used on these pages:

<p>
<details>
<summary>Page component</summary>

@inline components/Page.tsx

</details>
</p>

### Connecting actions and restrictions in the application

Let's create an application that connects the actions, constraints, and components from the previous examples:

<p>
<details>
<summary>Application entry point</summary>

@inline index.ts

</details>
</p>
