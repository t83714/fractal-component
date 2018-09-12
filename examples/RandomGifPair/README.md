# A Sample RandomGifPair UI Component

[![npm version](https://img.shields.io/npm/v/@fractal-components/random-gif-pair.svg)](https://www.npmjs.com/package/@fractal-components/random-gif-pair)
[![unpkg](https://img.shields.io/badge/unpkg-latest-blue.svg)](https://unpkg.com/@fractal-components/random-gif-pair)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@fractal-components/random-gif-pair.svg)](https://bundlephobia.com/result?p=@fractal-components/random-gif-pair)

## Overview

This is a sample UI Component built by re-using two [RandomGif](https://www.npmjs.com/package/@fractal-components/random-gif-pair) components. Its internal structure is simply as below:
```javascript
<div className={classes.table}>
    <div className={classes.cell}>RandomGif Pair</div>
    <div className={`${classes.cell}`}>
        <div>
            <RandomGif
                showButton={false}
                apiKey={this.props.apiKey}
                namespacePrefix={`${
                    this.componentManager.fullPath
                }/Gifs`}
                appContainer={this.props.appContainer}
            />
        </div>
        <div>
            <RandomGif
                showButton={false}
                apiKey={this.props.apiKey}
                namespacePrefix={`${
                    this.componentManager.fullPath
                }/Gifs`}
                appContainer={this.props.appContainer}
            />
        </div>
    </div>
    {this.props.showButton && (
        <div className={`${classes.cell} `}>
            <button
                onClick={() => {
                    this.componentManager.dispatch(
                        actions.requestNewPair()
                    );
                }}
                disabled={this.state.isLoading}
            >
                {this.state.isLoading
                    ? "Loading..."
                    : "Get Gif Pair"}
            </button>
        </div>
    )}
    {/**
        * Use ActionForwarder to throw NEW_GIF out of RandomGifPair container
        * Set namespace to `${this.componentManager.fullPath}/Gifs` in order to listen to
        * all `out of box` actions from two `RandomGif` components
        */}
    <ActionForwarder
        namespacePrefix={`${this.componentManager.fullPath}/Gifs`}
        pattern={RandomGifActionTypes.NEW_GIF}
        relativeDispatchPath="../../../../*"
        appContainer={this.props.appContainer}
    />

    {/**
        * Use ActionForwarder to forward LOADING_START & LOADING_COMPLETE actions from `RandomGif`
        * to current component (`RandomGifPair`)'s namespace.
        * i.e. from `${this.componentManager.fullPath}/Gifs` to `${this.componentManager.fullPath}`
        * Thus, `relativeDispatchPath` should be ".."
        */}
    <ActionForwarder
        namespacePrefix={`${this.componentManager.fullPath}/Gifs`}
        pattern={action =>
            action.type === RandomGifActionTypes.LOADING_START ||
            action.type === RandomGifActionTypes.LOADING_COMPLETE
        }
        relativeDispatchPath=".."
        appContainer={this.props.appContainer}
    />
</div>
```

## Quick Start

To try it out, simply create a HTML file with the following content (also available on [CodePen](https://codepen.io/t83714/pen/xaWVQe)):
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RandomGifPair Demo</title>
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
    <script src="https://unpkg.com/@fractal-components/random-gif-pair@latest/dist/@fractal-components/random-gif-pair.umd.js"></script>
  </head>
  <body>

    <div id="app_root"></div>
    <script type="text/babel">
    FractalComponent.AppContainerUtils.createAppContainer({
        //--- make dev tool always available
        reduxDevToolsDevOnly: false
    });
    ReactDOM.render(<RandomGifPair.default />, document.getElementById("app_root"));
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
import RandomGifPair, { actions, actionTypes} from "@fractal-components/random-gif-pair";

AppContainerUtils.createAppContainer({
    reduxDevToolsDevOnly: false
});

ReactDOM.render(<RandomGifPair />, document.getElementById("root"));
```

## API / Interface
### Component Properties

- apiKey: Giphy.com API key. If not set, default one will be used
- showButton: Boolean. Whether a click button should be shown. You will want to hide the button when you reuse this component to create a new component. e.g. `RandomGifPairPair`
- styles: Can used to replace the built-in styling. Accepts [JSS styling object](https://github.com/cssinjs/jss/blob/master/docs/json-api.md)

### Action Interface
#### Outgoing Actions
- NEW_GIF: Send out when a new gif url has been retrieved from Giphy.com
- LOADING_START: Send out when loading is started
- LOADING_COMPLETE: Send out when loading is completed

#### Outgoing Actions
- REQUEST_NEW_PAIR: Will attempt to get a pair of random Gifs from Giphy.com when receive this action

## Giphy.com API key

This comes with a testing Giphy.com API key in order to retrieve random Gifs from https://giphy.com/. The api key is limted to **40 requests** per hour.

You can create your own API key from https://developers.giphy.com/ and set the API key by `api` property. e.g.
```javascript
<RandomPair apiKey="xxxxxxxx" />
```
