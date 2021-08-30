#!/usr/bin/env node

try {
  require('../lib/index').run();
} catch (e) {
  console.error(e);
  console.error('Игнорируй ошибку выше при работе в репозитории tramvai');
}
