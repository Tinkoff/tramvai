---
id: tramvai-update
title: Tramvai update in application
sidebar_label: Tramvai update
---

Most of the libraries in the `tramvai` repository are combined into a common versioning - these are `core` packages, tram modules and tokens.
This makes it much easier to upgrade tramvai to a specific version.

Detailed documentation is available in the [Release section](concepts/versioning.md)

The cli command `tramvai update` has been developed to update packages.
This command updates the versions of all `@tramvai/*` and `@tramvai-tinkoff/*` dependencies in the application, and tries to deduplicate the `lock` file, adjusting to the package manager being used.

## Upgrading to a latest version

`tramvai update` by default use `latest`:

```bash
tramvai update
```

## Upgrading to a specific version

The `--to` flag allows you to specify the exact version:

```bash
tramvai update --to 1.0.0
```

## Checking tramvai versions in the app

The utility `@tramvai/tools-check-versions` has been created to automatically check the synchronization of tramvai versions.
To check, you need to run the command:

```bash
yarn tramvai-check-versions
```
