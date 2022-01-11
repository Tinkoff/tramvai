#!/usr/bin/env node

try {
  require('../lib/index').run();
} catch (e) {
  console.error(e);
  console.error('Ignore the error above when working in the tramvai repository');
}
