---
id: how-debug-modules
title: How to debug modules?
---

For convenient debugging of modules, it is necessary to enable logger display for unique logger IDs that were created in the modules being debugged. Library documentation [@tinkoff/logger](references/libs/logger.md) contains detailed examples of logger operation.

It is recommended to specify a list of logger identifiers in the README for each module, otherwise you can look up occurrences on the line `logger(` to find the necessary identifiers.

Levels and identifiers of displayed loggers are specified separately for server and for client, by default all loggers with level `error` and above are displayed.

### Displaying logs on the server

The server log settings are set in the `LOG_LEVEL` and `LOG_ENABLE` environment variables, if needed, you can change these settings in runtime, through the papi method `/{appName}/private/papi/logger` with additional query parameters.
You can read more about the available parameters in the documentation [@tramvai/module-log](references/modules/log.md)

```bash
LOG_ENABLE='router' // displays all logs for the logger with the ID `router`
```

### Displaying logs on the browser

Client logs settings are controlled by methods of the `@tinkoff/logger` library.
These settings are stored in the localStorage, so to display all client logs with new settings, you must additionally reload the page, or clear the localStorage.

```tsx
import logger from '@tinkoff/logger';

logger.enable('router'); // displays all logs for the logger with the ID `router`
```
