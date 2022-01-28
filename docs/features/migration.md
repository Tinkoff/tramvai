---
id: migration
title: Automatic migrations
---

Automatic migrations allow you to update the code and application settings when updating versions of tram modules or packages in the application itself.

## Why migrations are needed

Sometimes in the tram there is a need to make some kind of breaking changes and to simplify such a transition for end users, automatic migrations are used. Migrations allow you to transfer the application codebase to a new version of the interfaces in an automatic mode and practically without the participation of developers.

## How to use migrations

Migrations are performed automatically when new versions of tram packages are installed. The file `.tramvai-migrate-applied.json` in the root of the project is used to save information about migrations that have already been performed.

All that remains for application developers to do is:

- study the doc on [latest migrations for packages](https://tramvai.dev/docs/releases/migration)
- commit changes in the file `.tramvai-migrate-applied.json`, because it saves information about completed migrations and it is better to save it so as not to perform migrations again
- if after migrations `package.json` has changed, then you need to install packages to update the lock file in the project.
- review and commit all other changes that have occurred in the project (review is necessary because it is difficult to take into account all use cases in the migration, and also the result after the code transformation may not correspond to the linter settings in the current project).
- check the application for problems and make changes in accordance with the migration dock

## How to disable migrations

Add environment variable `SKIP_TRAMVAI_MIGRATIONS` before starting package installation.

## How migrations work

1.`@tramvai/core` contains the dependency `@tramvai/tools-migrate`
1.`@tramvai/tools-migrate` contains a script that runs on 'postinstall'
1.script analyzes tramvai modules in 'node_modules' and find all migrations
1.further the file `.tramvai-migrate-applied.json` is checked and a list of already selected migrations is taken from it if such a file exists
1.The code of migrations that are not in the list of completed ones is executed. Migrations are performed sequentially
1.in the file `.tramvai-migrate-applied.json` is added information about the migrations just performed, if the file was before, or this file is created

## Q/A

### Do I need to store `.tramvai-migrate-applied.json` in VCS?

Yes, otherwise, during the next migrations, we will not know which migrations have already been performed and repeated migrations will be performed
