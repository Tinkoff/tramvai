import { _interop_require_wildcard as _interopRequireWildcard } from "@swc/helpers";
function getModule(path) {
    return Promise.resolve().then(()=>_interopRequireWildcard(require('test-module')));
}
getModule().then(()=>{});
