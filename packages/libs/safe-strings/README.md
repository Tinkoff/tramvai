# @tramvai/safe-strings

Utility kit for a safe string encoding/decoding

## `safeParseJSON`

Tries to parse json and if it successful returns it, otherwise returns second argument as default value.

## `safeStringify`

Converts object to json with a replacement of insecure symbols that allows to insert result string in the response html

## `safeStringiyfJSON`

Converts object to json with a circular reference handling

## `removeXss`

Removes possible xss strings
