---
title: '@tramvai/types-actions-state-context'
sidebar_position: 6
---

# @tramvai/types-actions-state-context

This library combines the types for `@tramvai/core` and `@tramvai/state`.

The merging solves the problem of cyclic dependency between `@tramvai/core` and `@tramvai/state`,
because the `Action` and `ConsumerContext` interfaces depend on each other.

For internal use only!
