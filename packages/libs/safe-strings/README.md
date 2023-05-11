# @tramvai/safe-strings

Utility kit for a safe string encoding/decoding

## `safeParseJSON`

Tries to parse json and if it successful returns it, otherwise returns second argument as default value.

## `safeStringify`

Converts object to json with a replacement of insecure symbols that allows to insert result string in the response html

## `safeStringiyfJSON`

Converts object to json with a circular reference handling

## Encoding

Set of utility functions for encoding, mostly for XSS protection

### `encodeForHTMLContext`

String encoding for HTML context - escapes all symbols with possible XSS attack - `<`, `>`, `&`, `'`, `"`

### `encodeForJSContext`

String encoding for JS context - escapes all symbols with possible XSS attack or breaking code - `<`, `>`, `/`, `\u2028`, `\u2029`
