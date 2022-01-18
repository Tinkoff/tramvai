# Tool for code migrations

Tool for executing code migrations for the tramvai modules.

How does it work:

- in published module folder `__migrations__` contains migrations files for the execution
- found migrations that were have not been executed before are running
- migrations can change files `package.json`, `tramvai.json` and project source code
- after migration run information about executed migrations is added to file `.tramvai-migrate-applied.json` to the project root
- all of the changed files after migrations should be added and committed to remote repository

## How to

### Disable migrations

To disable migration add environment variable `SKIP_TRAMVAI_MIGRATIONS`.

### Add new migration

You can add new migration with command `yarn generate:migration`. You will need to specify package name for the migration and the migration name itself.

Also add to this package's `package.json` folder with the built migrations to the field `files` if it wasn't specified before:

```json
"files": [
    "lib",
    "__migrations__"
],
```

Migration is a function that accepts special api using which it implements changes to the source code or configs.

```tsx
export interface Api {
  packageJSON: PackageJSON; // object represented root package.json
  tramvaiJSON: TramvaiJSON; // object represented tramvai.json
  transform: (transformer: Transform, pathTransformer?: PathTransformer) => Promise<void>; // function that accepts transform function for `jscodeshift` and transform function for the file renames
}
```

Code transformations is done with [jscodeshift](https://github.com/facebook/jscodeshift)

## How to

### Write migration

#### Transformation

Rules:

- Prefer to return `null | undefined` or original source from the transform function in cases when migration doesn't change source code. Otherwise it will lead to unnecessary fs writing.
- Prefer to use embedded methods of collections returned by call `j(source)` to make searches and transforms
