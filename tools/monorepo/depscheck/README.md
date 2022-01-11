# @tinkoff-monorepo/depscheck

Tool for checking correctness dependency description.

Tool is configured through `.depscheckrc` file and cli options.

Under the hood [depcheck](https://github.com/depcheck/depcheck) is used.

## Config parameters for .depscheckrc.yml and cli

All of the available parameters for the `depscheck` can be seen in [docs](https://github.com/depcheck/depcheck/tree/0.9.2).

```sh
collector
  --collector                  Module for collecting packages for depshcheck.
                               Should implement interface
                               @tinkoff-monorepo/pkgs-collector ->
                               CollectorInterface (currently
                               @tinkoff-monorepo/pkgs-collector-pvm is used)
    [required] [default: {"name":"@tinkoff-monorepo/pkgs-collector-workspaces"}]
  --collector-config-strategy
                      [string] [choices: "about-to-update", "update", "changed",
    "changed-since-release", "affected", "released", "updated", "all"] [default:
                                                                   ["affected"]]

depcheck
  --depcheck-ignore-matches      List of module patterns that should not
                                 generate error in case they are missing in
                                 package.json              [array] [default: []]
  --depcheck-ignore-dirs         List of directory names that depscheck should
                                 not check                 [array] [default: []]
  --depcheck-skip-missing        Disable check for missing dependencies
                                                      [boolean] [default: false]
  --depcheck-ignore-bin-package  Disable checks in bin files for project
                                                      [boolean] [default: false]

Options:
  --version                   Show version number                      [boolean]
  --config                    Path to the config (by default cosmiconfig is
                              used)                                     [string]
  --fix                       Enables fix error mode. Currently only fixes
                              unused dependency errors[boolean] [default: false]
  --ignore-patterns           List of file patterns that should be ignored for
                              checks on missing deps       [array] [default: []]
  --ignore-peer-dependencies  List of module patterns from peerDependencies that
                              should not generate error when dependency is
                              missing                      [array] [default: []]
  --ignore-unused             List of module patterns that should not generate
                              error when dependency is not used
                                                           [array] [default: []]
  -h                          Show help                                [boolean]
```

### Config example

```yaml
ignore-patterns:
  ['**/*.spec.{ts,tsx}', '**/*.test.{ts,tsx}', '**/dynamic-components/*/shared/externals.{js,ts}']
depcheck-ignore-dirs: ['__integration__', 'examples', '__tests__']
depcheck-ignore-matches: ['@platform/cli', '@tramvai/tools-migrate']
```
