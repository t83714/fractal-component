# A Sample RandomGif UI Component

[![npm version](https://img.shields.io/npm/v/@fractal-components/random-gif.svg)](https://www.npmjs.com/package/@fractal-components/random-gif)
[![unpkg](https://img.shields.io/badge/unpkg-latest-blue.svg)](https://unpkg.com/@fractal-components/random-gif)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@fractal-components/random-gif.svg)](https://bundlephobia.com/result?p=@fractal-components/random-gif)

## Overview

This is a sample UI Component built using [fractal-component](https://github.com/t83714/fractal-component) to demonstrate its reusability.

## Quick Start

To try it out, simply create a HTML file with the following content (also available on [CodePen](https://codepen.io/t83714/pen/RYQWPg)):
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
        <script src="https://unpkg.com/babel-standalone@^7.0.0/babel.min.js"></script>
        <script src="https://unpkg.com/react@~16.8.0/umd/react.production.min.js"></script>
        <script src="https://unpkg.com/prop-types@~15.6.2/prop-types.min.js"></script>
        <script src="https://unpkg.com/react-dom@~16.8.0/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/redux-saga@~1.0.0/dist/redux-saga.min.umd.js"></script>
        <script src="https://unpkg.com/fractal-component@latest/dist/fractal-component.min.umd.js"></script>
        <script src="https://unpkg.com/jss@9.8.7/dist/jss.min.js"></script>
        <script src="https://unpkg.com/jss-preset-default@4.5.0/dist/jss-preset-default.min.js"></script>
        <script src="https://unpkg.com/@fractal-components/random-gif@latest/dist/@fractal-components/random-gif.umd.js"></script>
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
                    <RandomGif.default />
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
import RandomGif, { actions, actionTypes } from "@fractal-components/random-gif";

const appContainer = new AppContainer({
    reduxDevToolsDevOnly: false
});

ReactDOM.render(
    <AppContainerContext.Provider value={appContainer}>
        <RandomGif />
    </AppContainerContext.Provider>,
    document.getElementById("root")
);
```

## API / Interface
### Component Properties

- namespacePrefix: String. Optional. Used to extend component's namespace (without impact component's internal namespace) so that two components' namespaces have a common part. It will impact the action multicast dispatch.
- apiKey: Giphy.com API key. If not set, default one will be used
- showButton: Boolean. Whether a click button should be shown. You will want to hide the button when you reuse this component to create a new component. e.g. `RandomGifPair`
- styles: Can used to replace the built-in styling. Accepts [JSS styling object](https://github.com/cssinjs/jss/blob/master/docs/json-api.md)

### Action Interface
#### Outgoing Actions
- NEW_GIF: Send out when a new gif url has been retrieved from Giphy.com
- LOADING_START: Send out when loading is started
- LOADING_COMPLETE: Send out when loading is completed

#### Accepted Actions
- REQUEST_NEW_GIF: Will attempt to get a random Gif from Giphy.com when receive this action

## Giphy.com API key

This comes with a testing Giphy.com API key in order to retrieve random Gifs from https://giphy.com/. The api key is limted to **40 requests** per hour.

You can create your own API key from https://developers.giphy.com/ and set the API key by `api` property. e.g.
```javascript
<Random apiKey="xxxxxxxx" />
```
