# @tinkoff/browser-cookies

Tiny cookies library for the browser

Fork of [browser-cookies](https://github.com/voltace/browser-cookies)

## Features

- Clean and easy to use API
- Small footprint
- No dependencies
- RFC6265 compliant
- Cross browser support

## Installation

Using **npm**
```bash
npm install @tinkoff/browser-cookies
```

Using **yarn**
```bash
npm install @tinkoff/browser-cookies
```

## Usage

```ts
import { Cookies } from '@tinkoff/browser-cookies';

const cookies = new Cookies({ sameSite: 'lax' });

cookies.set('firstName', 'Lisa');
cookies.set('firstName', 'Lisa', { expires: 365 }); // Expires after 1 year
cookies.set('firstName', 'Lisa', { secure: true, domain: 'www.example.org' });

cookies.get('firstName'); // Returns cookie value (or null)

cookies.erase('firstName'); // Removes cookie
```

## API

`Cookies` API:
- method [constructor(`defaults`)](#constructor)
- method [set(`name`, `value` &#91;, `options`&#93;)](#set)
- method [get(`name`)](#get)
- method [erase(`name`, &#91;, `options`&#93;)](#erase)
- method [all()](#all)

<hr/><a name="set"></a>

[Cookies.set(`name`, `value` &#91;, `options`&#93;)](#set)
<br/>
Method to save a cookie.

| argument      | type   | description
|---------------|--------|------------
| **`name`**    | string | The name of the cookie to save.
| **`value`**   | string | The value to save, [percent encoding][ref-percent-encoding] will automatically be applied. Note that only strings are allowed as value, the [examples](#examples) section shows how to save JSON data.
| **`options`** | object | May contain any of the properties specified in [options](#options) below. If an option is not specified, the value configured in [Cookies.constructor](#constructor) will be used.


<hr/><a name="get"></a>

[Cookies.get(`name`)](#get)
<br/>
Method that returns a cookie value, or **null** if the cookie is not found. [Percent encoded][ref-percent-encoding] values will automatically be decoded.

| argument      | type   | description
|---------------|--------|------------
| **`name`**    | string | The name of the cookie to retrieve.

<hr/><a name="erase"></a>

[Cookies.erase(`name` &#91;, `options` &#93;)](#erase)
<br/>
Method to remove a cookie.

| argument      | type   | description
|---------------|--------|------------
| **`name`**    | string | The name of the cookie to remove.
| **`options`** | object | May contain the `domain` and `path` properties specified in [options](#options) below. If an option is not specified, the value configured in [Cookies.constructor](#constructor) will be used.

<hr/><a name="all"></a>

[Cookies.all()](#all)
<br/>
Method to get all cookies.
Returns an object containing all cookie values with the cookie names used as keys. Percent encoded names and values will automatically be decoded.

<hr/><a name="constructor"></a>

[Cookies.constructor(`defaults`)](#constructor)
<br/>
`defaults` argument may be used to change the default value of each option specified in [options](#options) below.


### Options
The options shown in the table below may be set to instance of [Cookies.constructor](#constructor) or passed as function argument to [Cookies.set()](#set) and [Cookies.erase()](#erase). Also check out the [Examples](#examples) further below.

| Name       | Type                       | Default | Description
|------------|----------------------------|---------|--------
| `expires`  | `Number`, `Date`, `String` | `0`     | Configure when the cookie expires by using one of the following types as value:<ul><li>A `Number` of days until the cookie expires. If set to `0` the cookie will expire at the end of the session.</li><li>A `Date` object such as `new Date(2018, 3, 27)`.</li><li>A `String` in a format recognized by [Date.parse()][ref-date-parse].</li></ul>
| `domain`   | `String`                   | `""`    | The [domain][ref-cookie-domain] from where the cookie is readable.<ul><li>If set to `""` the current domain will be used.</li></ul>
| `path`     | `String`                   | `"/"`   | The path from where the cookie is readable.<ul><li>The default value of `"/"` allows the cookie to be readable from all paths.</li><li>If set to `""` the cookie will only be readable from the current browser path.</li><li>Note that cookies don't support relative paths such as `"../../some/path"` so paths must be absolute like `"/some/path"`.</li></ul>
| `secure`   | `Boolean`                  | `false` | If true the cookie will only be transmitted over secure protocols like https.
| `httponly` | `Boolean`                  | `false` | If true the cookie may only be read by the web server.<ul><li> This option may be set to [prevent malicious scripts from accessing cookies][ref-httponly], not all browsers support this feature yet.</li></ul>
| `samesite` | `String`                   | `""`   | The `samesite` argument may be used to [prevent cookies from being sent along with cross-site requests][ref-samesite].<ul><li>If set to `""` the SameSite feature will not be used.</li><li>If set to `"Strict"` the cookie will only be sent along with "same-site" requests.</li><li>If set to `"Lax"` the cookie will be sent with "same-site" requests and with "cross-site" top-level navigations.</li></ul>This is an experimental feature as only [a few browsers support SameSite][ref-samesite-caniuse] and [the standard][ref-samesite-spec] has not been finalized yet. Don't use this feature in production environments.

## Examples
Count the number of a visits to a page:  
```ts
import { Cookies } from '@tinkoff/browser-cookies';

const cookies = new Cookies();

// Get cookie value
const visits = cookies.get('count') || 0;
console.log("You've been here " + parseInt(visits) + " times before!");

// Increment the counter and set (or update) the cookie
cookies.set('count', parseInt(visits) + 1, {expires: 365});
```

JSON may be saved by converting the JSON object into a string:  
```ts
import { Cookies } from '@tinkoff/browser-cookies';

const cookies = new Cookies();

// Store JSON data
const user = { firstName: 'Sofia', lastName: 'Dueñas' };
cookies.set('user', JSON.stringify(user))

// Retrieve JSON data
const userString = cookies.get('user');
alert('Hi ' + JSON.parse(userString).firstName);
```

The default cookie options may be changed:
```ts
import { Cookies } from '@tinkoff/browser-cookies';

// Apply defaults
const cookies = new Cookies({
  secure: true,
  expires: 7,
});

// 'secure' option enabled and cookie expires in 7 days
cookies.set('FirstName', 'John')

// 'secure' option enabled and cookie expires in 30 days
cookies.set('LastName', 'Smith', { expires: 30 })
```

The `cookies.all` method can be used for more advanced functionality, for example to erase all cookies except one:
```javascript
import { Cookies } from '@tinkoff/browser-cookies';

const cookies = new Cookies();

const cookieToKeep = 'FirstName'; // Name of the cookie to keep

// Get all cookies as an object
const allCookies = cookies.all();

// Iterate over all cookie names
for (let cookieName in allCookies) {
  // Erase the cookie (except if it's the cookie that needs to be kept)
  if (allCookies.hasOwnProperty(cookieName) && cookieName != cookieToKeep) {
	  cookies.erase(cookieName);
  }
}
```