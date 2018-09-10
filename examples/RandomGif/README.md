# A Sample RandomGif UI Component

## Overview

This is a sample UI Component built using [fractal-component](https://github.com/t83714/fractal-component) to demonstrate its reusability.

## Quick Start

To try it out, simply create a HTML file with the following content:
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RandomGif Demo</title>
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
    <script src="https://unpkg.com/@fractal-components/random-gif@latest/dist/@fractal-components/random-gif.umd.js"></script>
  </head>
  <body>

    <div id="app_root"></div>
    <script type="text/babel">
    FractalComponent.AppContainerUtils.createAppContainer({
        //--- make dev tool always available
        reduxDevToolsDevOnly: false
    });
    ReactDOM.render(<RandomGif.default />, document.getElementById("app_root"));
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
import RandomGif, { actions, actionTypes} from "@fractal-components/random-gif";

AppContainerUtils.createAppContainer({
    reduxDevToolsDevOnly: false
});

ReactDOM.render(<RandomGif />, document.getElementById("root"));
```

## API / Interface
### Component Properties

- apiKey: Giphy.com API key. If not set, default one will be used
- showButton: Boolean. Whether a click button should be shown. You will want to hide the button when you reuse this component to create a new component. e.g. `RandomGifPair`
- styles: Can used to replace the built-in styling. Accepts [JSS styling object](https://github.com/cssinjs/jss/blob/master/docs/json-api.md)

### Action Interface
#### Outgoing Actions
- NEW_GIF: Send out when a new gif url has been retrieved from Giphy.com
- LOADING_START: Send out when loading is started
- LOADING_COMPLETE: Send out when loading is completed

#### Outgoing Actions
- REQUEST_NEW_GIF: Will attempt to get a random Gif from Giphy.com when receive this action

## Giphy.com API key

This comes with a testing Giphy.com API key in order to retrieve random Gifs from https://giphy.com/. The api key is limted to **40 requests** per hour.

You can create your own API key from https://developers.giphy.com/ and set the API key by `api` property. e.g.
```javascript
<Random apiKey="xxxxxxxx" />
```
