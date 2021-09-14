# Minimalist ACL

Minimalistic ACL implementation for privileges management in javascript

[![NPM Version](https://img.shields.io/npm/v/minimalist-acl.svg?style=flat-square)](https://npmjs.org/package/minimalist-acl)
[![GitHub license](https://img.shields.io/github/license/kledenai/minimalist-acl.svg)](https://github.com/Kledenai/minimalist-acl/blob/master/LICENSE)

## Installation

```bash
$ npm i minimalist-acl --save
```

or

```bash
$ yarn add minimalist-acl --save
```

## Usage

```js
// using ES modules
import { check } from "minimalist-acl";
// using CommonJS modules
const { check } = require("minimalist-acl");

const user = {
  get roles() {
    return ["moderator"];
  },
};

const can = check("administrator || moderator", (role) => {
  return user.roles.includes(role);
});

if (!can) {
  throw new Error("You not allowed to this resource.");
}
```

## Syntax

`and (&&)` - administrator && moderator

`or (||)` - administrator || moderator

`not (!)` - administrator && !moderator

## Support

Having a problem? [Open an issue](https://github.com/kledenai/minimalist-acl/issues/new) I will be happy to help you.
