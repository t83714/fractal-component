# A Sample Counter UI Component

[![npm version](https://img.shields.io/npm/v/@fractal-components/counter.svg)](https://www.npmjs.com/package/@fractal-components/counter)
[![unpkg](https://img.shields.io/badge/unpkg-latest-blue.svg)](https://unpkg.com/@fractal-components/counter)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@fractal-components/counter.svg)](https://bundlephobia.com/result?p=@fractal-components/counter)

## Overview

This is a sample UI Component built using [fractal-component](https://github.com/t83714/fractal-component) to demonstrate its reusability.

## Quick Start

To try it out, simply create a HTML file with the following content (also available on [CodePen](https://codepen.io/t83714/pen/MqGjbW)):
```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Counter Demo</title>
        <!--
            Load `babel-standalone` to support JSX in script tag
        -->
        <script src="https://unpkg.com/@babel/standalone@^7.0.0/babel.min.js"></script>
        <script src="https://unpkg.com/react@~16.8.0/umd/react.production.min.js"></script>
        <script src="https://unpkg.com/prop-types@~15.6.2/prop-types.min.js"></script>
        <script src="https://unpkg.com/react-dom@~16.8.0/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/redux-saga@~1.0.0/dist/redux-saga.umd.min.js"></script>
        <script src="https://unpkg.com/fractal-component@latest/dist/fractal-component.min.umd.js"></script>
        <script src="https://unpkg.com/jss@9.8.7/dist/jss.min.js"></script>
        <script src="https://unpkg.com/jss-preset-default@4.5.0/dist/jss-preset-default.min.js"></script>
        <script src="https://unpkg.com/@fractal-components/counter@latest/dist/@fractal-components/counter.min.umd.js"></script>
    </head>
    <body>
        <div id="app_root"></div>
        <script type="text/babel">
            const appContainer = new FractalComponent.AppContainer({
                reduxDevToolsDevOnly: false
            });
            ReactDOM.render(
                <FractalComponent.AppContainerContext.Provider
                    value={appContainer}
                >
                    <Counter.default />
                </FractalComponent.AppContainerContext.Provider>,
                document.getElementById("app_root")
            );
        </script>
    </body>
</html>
```

You can also use it as ES6 module:
```javascript
import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import { AppContainer, AppContainerContext } from "fractal-component";
import Counter, { actions, actionTypes } from "@fractal-components/counter";

const appContainer = new AppContainer({
    reduxDevToolsDevOnly: false
});

ReactDOM.render(
    <AppContainerContext.Provider value={appContainer}>
        <Counter />
    </AppContainerContext.Provider>,
    document.getElementById("root")
);
```

## API / Interface
### Component Properties
- namespacePrefix: String. Optional. Used to extend component's namespace (without impact component's internal namespace) so that two components' namespaces have a common part. It will impact the action multicast dispatch.
- styles: Can used to replace the built-in styling. Accepts [JSS styling object](https://github.com/cssinjs/jss/blob/master/docs/json-api.md)

### Action Interface
#### Outgoing Actions
None

#### Accepted Actions
- INCREASE_COUNT: will increase counter by one. `import { actions } from "@fractal-components/counter"`, Then Use `actions.increaseCount()` to create action
