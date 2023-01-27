const pk1 = require('package-1');
const pk2 = require('package-2');
const pk3 = require('package-3');
const dep = require('package-dep');
const pkesm1 = require('package-esm-1');
const pkesm2 = require('package-esm-2');

console.log(pk1 + pk2 + pk3 + dep);
console.log(pkesm1 + pkesm2);
