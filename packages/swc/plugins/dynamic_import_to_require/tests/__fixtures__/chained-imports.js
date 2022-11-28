import { interopRequireWildcard as _interopRequireWildcard } from "@swc/helpers";
Promise.resolve().then(()=>_interopRequireWildcard(require('test-module'))).then(()=>Promise.resolve().then(()=>_interopRequireWildcard(require('test-module-2'))));
Promise.all([
    Promise.resolve().then(()=>_interopRequireWildcard(require('test-1'))),
    Promise.resolve().then(()=>_interopRequireWildcard(require('test-2'))),
    Promise.resolve().then(()=>_interopRequireWildcard(require('test-3')))
]).then(()=>{});
