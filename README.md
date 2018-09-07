# fractal-component

[![Build Status](https://travis-ci.org/t83714/fractal-component.svg?branch=master)](https://travis-ci.org/t83714/fractal-component)

`fractal-component` is a javascript library that can help you to encapsulate decoupled UI component easily. It aims to provide a one-stop solution that allows state store (redux) management, actions (messages, events) processing & routing, side-effect management and component styling to be encapsulated into one single software module. You can then reuse your component to create new components (composition), use in a different project or publish it as a NPM module. You can not only use those components in web browsers but also can render them at server-side (SSR) & create redux store snapshot easily ([see example](https://github.com/t83714/fractal-component/tree/master/examples/exampleAppSSR)).

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

To try it out, take a look at the [example apps](examples) and find out how `fractal-component` solves the classical [Scalable Architecture Problem](https://github.com/slorber/scalable-frontend-with-elm-or-redux).

## Install

```
yarn add fractal-component
```
or
```
npm install --save fractal-component
```

Alternatively, you may use the UMD builds from [unpkg](https://unpkg.com/fractal-component) directly in the <script> tag of an HTML page.

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