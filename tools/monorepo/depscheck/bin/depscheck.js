#!/usr/bin/env node

require('../lib/cli')
  .run()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  });
