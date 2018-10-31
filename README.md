# fractal-component

[![GitHub stars](https://img.shields.io/github/stars/t83714/fractal-component.svg?style=social&label=Star&maxAge=2592000)](https://github.com/t83714/fractal-component)
[![npm version](https://img.shields.io/npm/v/fractal-component.svg)](https://www.npmjs.com/package/fractal-component)
[![unpkg](https://img.shields.io/badge/unpkg-latest-blue.svg)](https://unpkg.com/fractal-component)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/fractal-component.svg)](https://bundlephobia.com/result?p=fractal-component)
[![Build Status](https://travis-ci.org/t83714/fractal-component.svg?branch=master)](https://travis-ci.org/t83714/fractal-component)

`fractal-component` is a javascript library that can help you to encapsulate decoupled UI component easily. It aims to provide a one-stop solution that allows state store (redux) management, actions (messages, events) processing & routing, side-effect management and component styling to be encapsulated into one single software module. You can then reuse your component to create new components (composition), use in a different project or publish it as [a NPM module](https://www.npmjs.com/package/@fractal-components/random-gif). You can not only use those components in web browsers but also can render them at server-side (SSR) & create redux store snapshot easily ([see example](https://github.com/t83714/fractal-component/tree/master/examples/exampleAppSSR)).

In order to achieve that, `fractal-component` introduce the following features to react / redux ecosystem:

- `Multicast` Actions
- Namespaced Actions
- Serializable [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) Action Type 
- `Hot Plug` Redux Reducer & Auto mount / unmount
- `Hot Plug` [Saga](https://redux-saga.js.org/) & Auto mount / unmount
- Namespaced Redux Store
- Auto Component State Management & Redux Store Mapping
- Enhanced Server Side Rendering (SSR) Support

With `fractal-component`, you can create reusable [Container Components](https://redux.js.org/basics/usagewithreact#presentational-and-container-components) and construct scalable [fractal architecture](https://www.metropolismag.com/architecture/science-for-designers-scaling-and-fractals/) application while still enjoy the convenience of [Redux dev tool](https://github.com/zalmoxisus/redux-devtools-extension) & predictable single global store.

A typical structure of Container Components created by `fractal-component` is illustrated in the graph below:

![Typical Container Container Component Structure Diagram](https://raw.githubusercontent.com/t83714/fractal-component/master/docs/assets/container-structure.png)

To try it out, take a look at the [example apps](https://github.com/t83714/fractal-component/tree/master/examples) and find out how `fractal-component` solves the classical [Scalable Architecture Problem](https://github.com/slorber/scalable-frontend-with-elm-or-redux).

## Install

```
yarn add fractal-component
```
or
```
npm install --save fractal-component
```

Alternatively, you may use the UMD builds from [unpkg](https://unpkg.com/fractal-component) directly in the `<script>` tag of an HTML page.

## Documents

### Table of Contents

- Introduction
  - [Beginner Tutorial](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/)
    - [1. Overview](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/Overview.html)
    - [2. InitialSetup](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/InitialSetup.html)
    - [3. RandomGif](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/RandomGif/)
        - [3.1 Get Started](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/RandomGif/GetStarted.html)
        - [3.2 Namespace](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/RandomGif/Namespace.html)
        - [3.3 A simple Switch / Namespaced State](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/RandomGif/NamespacedState.html)
        - [3.4 Request GIF / Namespaced Saga](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/RandomGif/NamespacedSaga.html)
        - [3.5 Styling / Component Namespace Data](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/RandomGif/ComponentNamespaceData.html)
        - [3.6 Encapsulation & External Interfaces](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/RandomGif/ExternalInterfaces.html)
    - [4. RandomGifPair](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/RandomGifPair/)
        - [4.1 Get Started](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/RandomGifPair/GetStarted.html)
        - [4.2 Incoming / Outgoing Actions](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/RandomGifPair/IncomingOutgoingActions.html)
    - [5. Conclusion](https://t83714.github.io/fractal-component/Introduction/BeginnerTutorial/Conclusion.html)
- Basic Concepts
  - [Recommended Component Structure](https://t83714.github.io/fractal-component/BasicConcepts/RecommendedStructure.html)
  - Component Namespace
  - Action Dispatch Tree
  - Symbol Action Type
  - Component State
  - Component Reducer
  - Component Saga
  - Component Styling
- Advanced Concepts
  - ActionForwarder
  - SagaMonitor
- [API Reference](https://t83714.github.io/fractal-component/api/)
  - [AppContainer](https://t83714.github.io/fractal-component/api/AppContainer.html)
  - [AppContainerUtils](https://t83714.github.io/fractal-component/api/AppContainerUtils.html)
  - [ComponentManager](https://t83714.github.io/fractal-component/api/ComponentManager.html)
  - [ActionForwarder](https://t83714.github.io/fractal-component/api/ActionForwarder.html)
  - [utils](https://t83714.github.io/fractal-component/api/utils.html)


## Quick Start

A Reusable RandomGif Component. You can also find complete source code [here](https://github.com/t83714/fractal-component/tree/master/examples/exampleApp/src/components/RandomGif).

```javascript
import React from "react";
import PropTypes from "prop-types";
import { AppContainerUtils } from "fractal-component";

import reducer from "./reducers";
import saga from "./sagas";
import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import partialRight from "lodash/partialRight";

import jss from "jss";
import styles from "./styles";

class RandomGif extends React.Component {
    constructor(props) {
        super(props);
        /**
         * You can set component initState via AppContainerUtils.registerComponent options as well.
         * this.state gets higher priority
         */
        this.state = {
            isLoading: false,
            imageUrl: null,
            error: null
        };
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714/RandomGif",
            reducer: reducer,
            saga: partialRight(saga, props.apiKey),
            /**
             * Register actions for action serialisation / deserialisation.
             */
            actionTypes,
            // --- only accept one type of external multicast action
            // --- By default, component will not accept any incoming multicast action.
            // --- No limit to actions that are sent out
            allowedIncomingMulticastActionTypes: [actionTypes.REQUEST_NEW_GIF],
            /**
             * Namespace callbacks make sure style sheet only create once 
             * for all component instances
            */
            namespaceInitCallback: componentManager => {
                const styleSheet = jss
                    .createStyleSheet(styles, {
                        generateClassName: componentManager.createClassNameGenerator()
                    })
                    .attach();
                return { styleSheet };// --- stored as namespace data
            },
            namespaceDestroyCallback: ({ styleSheet }) => {
                styleSheet.detach();
            }
        });
    }

    render() {
        const { styleSheet } = this.componentManager.getNamespaceData();
        const { classes } = styleSheet;
        return (
            <div className={classes.table}>
                <div className={classes.cell}>RandomGif</div>
                <div
                    className={`${classes.cell} ${classes["image-container"]}`}
                >
                    {this.state.imageUrl &&
                        !this.state.isLoading &&
                        !this.state.error && (
                            <img
                                alt="Gif"
                                src={this.state.imageUrl}
                                className={`${classes.image}`}
                            />
                        )}
                    {(!this.state.imageUrl || this.state.isLoading) &&
                        !this.state.error && (
                            <p>
                                {this.state.isLoading
                                    ? "Requesting API..."
                                    : "No GIF loaded yet!"}
                            </p>
                        )}
                    {this.state.error && (
                        <p>{`Failed to request API: ${this.state.error}`}</p>
                    )}
                </div>
                {this.props.showButton && (
                    <div className={`${classes.cell} `}>
                        <button
                            onClick={() => {
                                this.componentManager.dispatch(
                                    actions.requestNewGif()
                                );
                            }}
                            disabled={this.state.isLoading}
                        >
                            {this.state.isLoading
                                ? "Requesting API..."
                                : "Get Gif"}
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

RandomGif.propTypes = {
    showButton: PropTypes.bool,
    apiKey: PropTypes.string
};

RandomGif.defaultProps = {
    showButton: true,
    apiKey: "xxxxxxxxxxxxxxx"
};

export default RandomGif;

//--- actions component may send out
const exposedActionTypes = {
    NEW_GIF : actionTypes.NEW_GIF,
    LOADING_START: actionTypes.LOADING_START,
    LOADING_COMPLETE: actionTypes.LOADING_COMPLETE
};
//--- action component will accept
const exposedActions = {
    requestNewGif: actions.requestNewGif
};
/**
 * expose actions for component users
 */
export { exposedActionTypes as actionTypes, exposedActions as actions };
```
