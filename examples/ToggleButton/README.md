# A Sample ToggleButton UI Component

[![npm version](https://img.shields.io/npm/v/@fractal-components/toggle-button.svg)](https://www.npmjs.com/package/@fractal-components/toggle-button)
[![unpkg](https://img.shields.io/badge/unpkg-latest-blue.svg)](https://unpkg.com/@fractal-components/toggle-button)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@fractal-components/toggle-button.svg)](https://bundlephobia.com/result?p=@fractal-components/toggle-button)

## Overview

This is a sample UI Component built using [fractal-component](https://github.com/t83714/fractal-component) to demonstrate its reusability.

## Quick Start

To try it out, simply create a HTML file with the following content (also available on [CodePen](https://codepen.io/t83714/pen/JavEjV)):
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toggle Button Demo</title>
    <!--
        Load `babel-standalone` to support JSX in script tag
    -->
    <script src="https://unpkg.com/babel-standalone@7.0.0-beta.3/babel.min.js"></script>
    <script src="https://unpkg.com/react@16.5.0/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/prop-types@15.6.2/prop-types.min.js"></script>
    <script src="https://unpkg.com/react-dom@16.5.0/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/redux-saga@1.0.0-beta.2/dist/redux-saga.min.umd.js"></script>
    <script src="https://unpkg.com/fractal-component@latest/dist/fractal-component.min.umd.js"></script>
    <script src="https://unpkg.com/jss@9.8.7/dist/jss.min.js"></script>
    <script src="https://unpkg.com/jss-preset-default@4.5.0/dist/jss-preset-default.min.js"></script>
    <script src="https://unpkg.com/@fractal-components/toggle-button@latest/dist/@fractal-components/toggle-button.min.umd.js"></script>
  </head>
  <body>

    <div id="app_root"></div>
    <script type="text/babel">
    FractalComponent.AppContainerUtils.createAppContainer({
        reduxDevToolsDevOnly: false
    });
    ReactDOM.render(<ToggleButton.default />, document.getElementById("app_root"));
    </script>
  </body>
</html>

```

You can also use it as ES6 module:
```javascript
import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import { AppContainerUtils } from "fractal-component";
import ToggleButton, { actions, actionTypes} from "@fractal-components/toggle-button";

AppContainerUtils.createAppContainer({
    reduxDevToolsDevOnly: false
});

ReactDOM.render(<ToggleButton />, document.getElementById("root"));
```

## API / Interface
### Component Properties
- namespacePrefix: String. Optional. Used to extend component's namespace (without impact component's internal namespace) so that two components' namespaces have a common part. It will impact the action multicast dispatch.
- pattern: String, function or array. pattern of accepting action types. "*" stands for all types.
- relativeDispatchPath: the relative action dispatch namespace path. ".." stands for up one level. "../.." stands for up two levels etc.
- transformer: symbol or function: convert received actions to a new action type.
- styles: Can used to replace the built-in styling. Accepts [JSS styling object](https://github.com/cssinjs/jss/blob/master/docs/json-api.md)

### Action Interface
#### Outgoing Actions
- All Actions Types: This component works as an `ActionForwarder` that will accept all possible actions, transform and forward to another namespace.

#### Accepted Actions
- All Action Types: This component works as an `ActionForwarder` that will accept all possible actions, transform and forward to another namespace.
