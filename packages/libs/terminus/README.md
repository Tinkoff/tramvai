# @tinkoff/terminus

Fork of the library [@godaddy/terminus](https://github.com/godaddy/terminus).

## Features

`healthChecks` handlers are creater for an `express` app, in contrast to original library which redefines `request` event handler of server object.

Original behaviour is more complicated in case of a need to add common logic for every request in the app, including `healthChecks` itself. E.g. it was not possible to add http-header in single place to make it work for every request.
