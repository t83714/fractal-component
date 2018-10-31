## utils

- [`Overview`](#overview)
- [`utils.is`](#utilsis)
- [`utils.isInNode`](#utilsisinnode)
- [`utils.isDevMode`](#utilsisdevmode)
- [`utils.getPackageVersion`](#utilsgetpackageversion)
- [`utils.symbolToString`](#utilssymboltostring)

### Overview

`utils` module provides a list of useful utility functions. 

### `utils.is`

`utils.is` provides a list of useful data type checking functions:
- `action`: test whether a value is an valid action object. `fractal-component` requires action type must be a [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- `symbol`: test whether a value is a [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol). 

You should use this function to test whether a value is a `Symbol` rather than using `typeof` operator for better performance & compatibility. Since [babel 7](https://babeljs.io/docs/en/v7-migration#babel-preset-env), `loose` mode of `@babel/preset-env` will now automatically exclude the typeof-symbol transform. 

- `pattern`: test whether a value is an action [pattern](https://github.com/redux-saga/redux-saga/tree/v1.0.0-beta.2/docs/api#takepattern)
- `channel`: test whether a value is a [channel](https://redux-saga.js.org/docs/api/#channel)
- `buffer`: test whether a value is a [Buffer](https://redux-saga.js.org/docs/api/#buffer)
- `iterator`: test whether a value is a [iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterators)
- `iterable`: test whether a value is a [iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators#Iterables)
- `promise`: test whether a value is [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- `object`: test whether a value is an `object`
- `array`: test whether a value is an `array`
- `string`: test whether a value is a `string`
- `number`: test whether a value is a `number`
- `bool`: test whether a value is a `bool`
- `func`: test whether a value is a `function`
- `undef`: test whether a value is `null` or `undefined`
- `notUndef`: test whether a value is NOT `null` and `undefined`

#### Example:

```javascript
import { utils } from "fractal-component";
const actionValid = {
    type : Symbol("ACTION_TYPE_ONE")
};
const actionInvalid = {
    type : "ACTION_TYPE_TWO"
};
console.log(utils.is.action(actionValid)); // --- true
console.log(utils.is.action(actionInvalid)); // --- false
```

###  `utils.isInNode`

Whether code is running in [nodejs](https://nodejs.org/en/) environment.

```javascript
import { utils } from "fractal-component";
utils.isInNode(); //--- return true if running in nodejs otherwise return false
```

### `utils.isDevMode`

Whether code is running under `development` mode. If you use `webpack`, You can use the [mode](https://webpack.js.org/concepts/mode/) option to set `development` mode when create code bundle. e.g.

```bash
webpack --mode=development
```
By default, `Redux DevTools` is only allowed to connect to your App if you bundle your code under `development` mode. You can change this behivour by `reduxDevToolsDevOnly` option when creates the [AppContainer](./AppContainer.md#initialisation-constructor).

### `utils.getPackageVersion`

Return `fractal-component` version number.

### `utils.symbolToString`

Get string representation of a [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol).

While you can call toString() on Symbols, you can't use string concatenation with them (see [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toString#No_string_concatenation)):

```javascript
Symbol('foo') + 'bar';       // TypeError: Can't convert symbol to string
```

You want to use this function to get the string representation of a `Symbol` rather than using `bar.toString()` as most minifier (e.g. [UglifyJS](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)) will replace `bar.toString()` with `''+bar` in order to reduce code size when bundle your code. This will, however, produce an error when `bar` is a `Symbol`.

