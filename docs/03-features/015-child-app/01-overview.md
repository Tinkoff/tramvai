---
id: overview
title: Overview
---

[Micro frontends](https://micro-frontends.org/) heavily integrated with `tramvai` framework

## Concepts

- **Root App** - usual `tramvai` application constructed with `createApp` from `@tramvai/core`. It can connect with many Child Apps
- **Child App** - external microfrontend constructed with `createChildApp` from `@tramvai/child-app-core`. It is loaded by Root App and provides some external functionality

## Features

- Child App can be developed independently from Root Apps in another repo
- High integration with DI, including isolated DI container and child -> root communication
- Child App is isolated from Root App and can only communicate with Root App through special channels (mainly through DI)

## Limitations

### Usage of envs

Child-app cannot control the environment variables and therefore should not use token `ENV_USED_TOKEN` at all. If you try to specify `ENV_USED_TOKEN` provider you will get error in development mode and in prod mode it will just be ignored.

Controlling of the envs content should be fully delegated to the Root App itself. Child App can only use final values through `ENV_MANAGER_TOKEN` or any other options that passes data from Root App to Child App.
