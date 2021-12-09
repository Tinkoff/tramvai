# Putting inline code for the client on server

Sometimes there is a need to construct js-code on server to then put it to the initial html render. The issue raises if EcmaScript version used on server for generating client code is not supported by client browser (this usually happens because we use es2015+ while writing code but of the clients still use outdated browsers that support only es5). Even more, if server code is get transpiled on server it still transpiles to a specific nodejs version that is not suitable for browsers.

## Solution

For clients transpilation is already happens using wepback and babel that targets specific browsers. That way we can reuse that transpilation for client code in order to build specific code on the server which is intended to use on client-side.

Rules for transpiling specific code for clients on the server:

- code for insertion must be placed in separate file
- inside that file no imports should be used as it requires webpack runtime which won't know about server modules on the client
- code itself should be defined as exported function and these functions can use only passed arguments. Using external variables is not possible
- the name of the file should end on `.inline(.es)?.[tj]s`. It works as a marker to transpile this file with a client config
- instead on inline code put to the insertion place the string with call of the exported function with passing arguments to it. Thanks to the fact that conversion function to string returns the body of the function itself it should work on the client

### Example

1. Create new file `test.inline.ts` with the inline code

   ```ts
   export const test = (arg: string) => {
     class Test {
       log() {
         console.log({
           arg,
           a: 1,
         });
       }
     }

     const t = new Test();

     t.log();
   };
   ```

2. Import the exported function and put it to the initial html

   ```ts
   import { Module } from '@tramvai/core';
   import { RENDER_SLOTS, ResourceType, ResourceSlot } from '@tramvai/module-render';
   import { test } from './test.inline';

   @Module({
     providers: [
       {
         provide: RENDER_SLOTS,
         multi: true,
         useFactory: () => {
           const arg = 'Hello';

           return {
             slot: ResourceSlot.HEAD_SCRIPTS,
             type: ResourceType.inlineScript,
             // Please, note that we are using function like we are adding new iife function, but instead of adding the body of function manually we are using import from the module
             // And when passing string as arguments we should additionally wrap it with quotes
             payload: `(${test})('${arg}')`,
           };
         },
       },
     ],
   })
   export class CustomModule {}
   ```

3. After building the project and requesting the page, the browser should get the code looking like that instead of source code

   ```html
   <script>
     (function test(arg) {
       var Test = /*#__PURE__*/ (function () {
         function Test() {}

         var _proto = Test.prototype;

         _proto.log = function log() {
           console.log({
             arg: arg,
             a: 1,
           });
         };

         return Test;
       })();

       var t = new Test();
       t.log();
     })('Hello');
   </script>
   ```
