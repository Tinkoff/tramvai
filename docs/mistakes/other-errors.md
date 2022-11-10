---
title: Other errors
sidebar_position: 99
---

Other errors that may happen during development or using of the tramvai app.

## Mismatched dependencies version

Most of the tramvai dependencies must have the same version. [Here](concepts/versioning.md) you can read more details about versioning in tramvai.

If some of your dependencies have mismatched versions it may lead to myriads of different errors.

Here is non-exhaustive list of possible errors that comes from mismatched versions:

- `Cannot use 'in' operator to search for 'token' in undefined`

### Solution

To prevent these errors from happening prefer to use [tramvai update/add](how-to/tramvai-update.md) commands over bare package-manager usage for installing/updating tramvai related packages.

If you've already faced these errors you can run command [tramvai-check-versions](how-to/tramvai-update.md#checking-tramvai-versions-in-the-app) to validate if you have mismatched dependencies. If you've got any errors then you have next options to do:

- if your current local changes led to error, consider reverting your changes related to dependencies and use [tramvai update/add](how-to/tramvai-update.md) commands to make changes.
- resolve conflicts manually i.e. make changes that will lead to the same versions of tramvai related dependencies
- if suggestions from above didn't help please report the issue to tramvai-dev team
