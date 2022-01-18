# Tool for checking module versions in the tramvai application

Various conflicts and compatibility errors may rise when using _mismatched_ versions of the tramvai dependencies. That's way this tool exists.

The tool checks that all of the tramvai dependencies are consistent in `package.json` for the app. That includes checks for mismatched versions between different dependencies and checks for mismatched versions in `package.json` and real versions that are resolved in dependency tree.

Example of the wrong dependencies:

```json
"dependencies": {
  "@tramvai/core": "0.5.0", // the most fresh version. The error will be thrown with the suggestion to update other dependencies
  "@tramvai/module-common": "0.4.2",
  "@tramvai/module-router": "0.4.2",
  "@tramvai/state": "0.4.2",
}
```

## Prerelease versions

Prerelease versions often used for the testing. The tool will recognize prerelease versions for the tramvai dependencies and won't count this as mismatched in case all of the prerelease versions are higher than other stable versions.

```json
"dependencies": {
    "@tramvai/core": "0.5.0-rc.2", // release candidate version. The version is higher than other dependencies, so no error will be generated
    "@tramvai/module-common": "0.4.2",
    "@tramvai/module-router": "0.4.2",
    "@tramvai/state": "0.4.2",
}
```

## Patterns for the related dependencies

Packages with the name that matches the following patterns are considered related and for these packages the `@tramvai/tools-check-versions` will execute checks

- `/^@tramvai\/core$/`
- `/^@tramvai\/module-/`
- `/^@tramvai-tinkoff\/module-/`
- `/^@tramvai\/tokens-/`
