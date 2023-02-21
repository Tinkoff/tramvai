---
id: overview
title: Introduction to tramvai
sidebar_position: 1
---

`tramvai` is a lightweight web framework for building SSR applications with a modular system and DI to quickly extend the functionality of applications.

## Main features

- **Modular approach** - you can extend the functionality of applications using modules
- **Universal** - Works equally well for browsers and server
- **Fast** - lightweight, does not affect the overall performance of the application, maximizes parallelization of actions on the server

## Approaches used

![tramvai main](/img/tramvai/tramvai-main.jpg)

### Modularity

The architecture `tramvai` is based on the idea that we have all the functionality divided into various modules and all communication between the modules is based on common interfaces, interacting through `DI`. This architecture makes it possible to easily add new functionality to the application, and replace existing functionality.

### Standardization

`tramvai` is a framework that allows you to maintain and create applications with the same architecture for many teams with the ability to share code between projects, as it `tramvai` is a lightweight layer that helps to interact different modules in the application

### Performance

The core `tramvai` together with `DI` weighs 4 kb, everything else is implemented through third-party modules that extend the functionality of the application. This makes it possible to make applications of the minimum size, excluding unnecessary features. The architecture and modules are designed with a concept `performance first` for maximum parallelization, according to best practice.

### Universal

`tramvai` it is an SSR-first framework and takes into account all the features and problems associated with the server, client and the interaction between them:

- All modules are developed for both the browser and the server
- Common interfaces are used
- A [chain of commands](concepts/command-line-runner.md) on the server and the browser is used which allows you to perform actions in determining the lifetime of the application
- The [action system](concepts/action.md) allows you to equally request data on the server and in the browser, using various features (e.g. repetition in the browser of an action that crashed on the server)

### Splitting into external libraries

When developing `tramvai` we try to use open source solutions, or create basic libraries that are in no way related to `tramvai` and can be used in other projects and frameworks.

### DI with interface taken from Nest or Angular DI

`DI` is the core part of `tramvai` that allows you to reduce code cohesion and separation of functionality into modules. `tramvai` use a library `@tinkoff/dippy` that implements the `DI` container. The internal interface `DI` repeats the interface `Nest`, which allows you to conveniently describe the dependencies and implementations of classes.

### Soft migration option

A million + lines of code have already been written on `tinkoff.ru` and the new solution should not break the existing code, and also require applications from a difficult and long transition

## Why was it developed

### tramvai

Often, React applications are a constructor from different libraries that have been included in the project. This works well on a small scale, but it does not work well for large applications with 70+ developers, since in this approach it is easy to connect your own and disperse radically in the application architecture. This problem is taken over `tramvai` and standardized and implemented by a common application architecture that all product teams use.

There are not many open source solutions on github that implement the architecture of large applications.

#### Alternatives

##### next.js

One of the best simple React frameworks that takes care of server-side rendering and routing. At the same time, this is a lightweight framework that does not standardize in any way and does not solve the problems with the modularity of components. Therefore, most of the code that was written on `tramvai` would have to be written for `next.js` and try to somehow implement, since in `next.js` the ability to extend functionality is very limited

##### fusion.js

A similar framework that evolved and emerged at the same time with `tramvai`. Fusion.js does not have a full-fledged DI, a limited ability to move functionality into modules and the entire architecture is built on the basis of middlewares, and there are difficulties around the hard-coded priorities of plugins and the lack of parallelization of actions

##### nest.js

An excellent backend framework that uses similar DI, but is not completely sharpened for SSR. And when using it, we had to have 2 architectures, one for the backend, the other written by ourselves for the client

### @tinkoff/dippy

Lightweight DI library with Angular-like interface. In the open source, there are not so many different DI options that allow you to separate class implementations, both basic general and specific for each client.

#### Alternatives

##### inversify

This is the most popular library for creating DI, with:

- weighs 11kb, compared to dippy 1.2kb
- a low-level API that requires different wrappers to implement a modular system.
- `ts-nest` this is an example of a wrapper over inversify that has weak support and only the wrapper contains about the same code as `@tinkoff/dippy`

### state

The [state management library](03-features/08-state-management.md) built into tramvai is almost completely similar to the Redux interface, with few nuances:

- Allows you to sign components only for updating certain reducers, solving the problem with performance
- There is a lot of code written using the deprecated version of the state and you can't just switch to another solution

#### Alternatives

##### redux

Moving to pure redux will not solve the problems, it will only add performance-related ones

##### reatom

Very similar to our state manager, a new library that addresses the issue of updates and performance. A good candidate to take some features from. Full transition is very expensive due to the codebase

##### effector

Interesting library that has a focus on the client side and is not very suitable for SSR

## Concepts

### Module

The main basic elements of the `tramvai` architecture that contain the implementation of functionality. At the same time, it is assumed that such modules will not be huge and a large number of different types will appear.

[Documentation](concepts/module.md)

### DI system

`tramvai` is built on a DI system that stores the implementation of functionality and receiving implementations for tokens and keys. This allows you to implement communications between modules based only on interfaces, while having the ability to change implementations as needed.

[Documentation](concepts/di.md)

### CommandLineRunner

Runner for a list of actions that modules can attach actions to. There are 2 types of action lists:

- Application initialization
- Processing a request for a client

Within the framework of this list of actions, routes, user status, page rendering and html return to the client are received.

[Documentation](concepts/command-line-runner.md)
