# fractal-component

[![GitHub stars](https://img.shields.io/github/stars/t83714/fractal-component.svg?style=social&label=Star&maxAge=2592000)](https://github.com/t83714/fractal-component)
[![npm version](https://img.shields.io/npm/v/fractal-component.svg)](https://www.npmjs.com/package/fractal-component)
[![unpkg](https://img.shields.io/badge/unpkg-latest-blue.svg)](https://unpkg.com/fractal-component)
[![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/fractal-component.svg)](https://bundlephobia.com/result?p=fractal-component)
[![Build Status](https://travis-ci.org/t83714/fractal-component.svg?branch=master)](https://travis-ci.org/t83714/fractal-component)

`fractal-component` is a javascript library that can help you to encapsulate decoupled UI component easily. It aims to provide a one-stop solution that allows state store (redux) management, actions (messages, events) processing & routing, side-effect management and component styling to be encapsulated into one single software module. You can then reuse your component to create new components (composition), use in a different project or publish it as [a NPM module](https://www.npmjs.com/package/@fractal-components/random-gif) (See the [live demo](https://codepen.io/t83714/pen/yxjgWr) on CodePen). You can not only use those components in web browsers but also can render them at server-side (SSR) & create redux store snapshot easily ([see example](https://github.com/t83714/fractal-component/tree/master/examples/exampleAppSSR)).

In order to achieve that, `fractal-component` introduce the following features to react / redux ecosystem:

- `Multicast` Actions
- Namespaced Actions
- Serializable [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) Action Type 
- `Hot Plug` Redux Reducer & Auto mount / unmount
- `Hot Plug` [Saga](https://redux-saga.js.org/) & Auto mount / unmount
- Namespaced Redux Store
- Auto Component State Management & Redux Store Mapping
- Enhanced Server Side Rendering (SSR) Support
- Support React [Function Components](https://reactjs.org/docs/components-and-props.html#function-and-class-components) via [React Hooks API](https://reactjs.org/docs/hooks-custom.html) (See [Example App](https://github.com/t83714/fractal-component/tree/master/examples/exampleAppHooks))

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

## Changelog

** New: Added React [New Context API support](https://reactjs.org/docs/context.html) (Requires React Version 16.6.0 and above)
** New: Support Function Component via [New Hooks API](https://reactjs.org/docs/hooks-custom.html) (Requires React Version 16.8.0 and above)

Please find the complete Changelog from [here](./CHANGES.md).

## Quick Start

You don't have to use [Webpack](https://webpack.js.org/) / [Babel](https://babeljs.io/) to compile / bundle any code before you can play with components built with `fractal-component`. Simply create a HTML file with the content below, open it with your web browser and you are good to go. The single HTML file will pull the UMD version of published components from CDN and run in your browser. Components included by this demo are:
- RandomGif: [Source code](https://github.com/t83714/fractal-component/tree/master/examples/RandomGif)
- RandomGifPair: built by reusing `RandomGif`. [Source code](https://github.com/t83714/fractal-component/tree/master/examples/RandomGifPair)
- RandomGifPairPair: built by reusing `RandomGifPair`. [Source code](https://github.com/t83714/fractal-component/tree/master/examples/RandomGifPairPair)
- ToggleButton: [Source code](https://github.com/t83714/fractal-component/tree/master/examples/ToggleButton)
- Counter: [Source code](https://github.com/t83714/fractal-component/tree/master/examples/Counter)

Bundled version of the complete exampleApp can be found from [here](https://github.com/t83714/fractal-component/tree/master/examples/exampleApp).

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ExampleApp Demo</title>
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
        <script src="https://unpkg.com/lodash@4.17.10/lodash.min.js"></script>
        <script src="https://unpkg.com/@fractal-components/random-gif@latest/dist/@fractal-components/random-gif.min.umd.js"></script>
        <script src="https://unpkg.com/@fractal-components/random-gif-pair@latest/dist/@fractal-components/random-gif-pair.umd.js"></script>
        <script src="https://unpkg.com/@fractal-components/random-gif-pair-pair@latest/dist/@fractal-components/random-gif-pair-pair.min.umd.js"></script>
        <script src="https://unpkg.com/@fractal-components/counter@latest/dist/@fractal-components/counter.min.umd.js"></script>
        <script src="https://unpkg.com/@fractal-components/toggle-button@latest/dist/@fractal-components/toggle-button.min.umd.js"></script>
    </head>

    <body>
        <div id="app_root"></div>
        <script type="text/babel">
            const appContainer = new FractalComponent.AppContainer({
                reduxDevToolsDevOnly: false
            });

            const styles = {
                table: {
                    display: "flex",
                    "flex-wrap": "wrap",
                    margin: "0.2em 0.2em 0.2em 0.2em",
                    padding: 0,
                    "flex-direction": "rows"
                },
                cell: {
                    "box-sizing": "border-box",
                    "flex-grow": 0,
                    overflow: "hidden",
                    padding: "0.2em 0.2em",
                    "border-bottom": "none",
                    display: "flex",
                    "align-items": "center",
                    "justify-content": "flex-start"
                }
            };

            const createStyleSheet = _.once(() => {
                return jss
                    .create()
                    .createStyleSheet(styles, {
                        generateClassName: FractalComponent.utils.createClassNameGenerator(
                            "exampleApp"
                        )
                    })
                    .attach();
            });

            function App() {
                const { classes } = createStyleSheet();
                const ActionForwarder = FractalComponent.ActionForwarder;
                return (
                    <div>
                        <div className={classes.table}>
                            <div className={classes.cell}>
                                {/*
                            RandomGif / RandomGifPair / RandomGifPairPair support apiKey property as well
                            You can supply your giphy API key as component property
                        */}
                                <RandomGif.default namespacePrefix="exampleApp/RandomGif" />
                                {/*Forward `NEW_GIF` actions (and convert to `INCREASE_COUNT`) to ToggleButton for processing*/}
                                <ActionForwarder
                                    namespacePrefix="exampleApp/RandomGif"
                                    pattern={RandomGif.actionTypes.NEW_GIF}
                                    relativeDispatchPath="../ToggleButton/*"
                                    transformer={
                                        Counter.actionTypes.INCREASE_COUNT
                                    }
                                />
                            </div>
                            <div className={classes.cell}>
                                <Counter.default namespacePrefix="exampleApp/Counter" />
                            </div>
                        </div>
                        <div className={classes.table}>
                            <div className={classes.cell}>
                                <RandomGifPair.default namespacePrefix="exampleApp/RandomGifPair" />
                                {/*Forward `NEW_GIF` actions (and convert to `INCREASE_COUNT`) to ToggleButton for processing*/}
                                <ActionForwarder
                                    namespacePrefix="exampleApp/RandomGifPair"
                                    pattern={RandomGif.actionTypes.NEW_GIF}
                                    relativeDispatchPath="../ToggleButton/*"
                                    transformer={
                                        Counter.actionTypes.INCREASE_COUNT
                                    }
                                />
                            </div>
                            <div className={classes.cell}>
                                {/*
                            ToggleButton acts as a proxy --- depends on its status
                            add an `toggleButtonActive`= true / false field to all actions
                            and then forward actions to Counter
                        */}
                                <ToggleButton.default
                                    namespacePrefix="exampleApp/ToggleButton"
                                    pattern={Counter.actionTypes.INCREASE_COUNT}
                                    relativeDispatchPath="../Counter/*"
                                    transformer={
                                        Counter.actionTypes.INCREASE_COUNT
                                    }
                                />
                            </div>
                        </div>
                        <div>
                            <RandomGifPairPair.default namespacePrefix="exampleApp/RandomGifPairPair" />
                            {/*Forward `NEW_GIF` actions (and convert to `INCREASE_COUNT`) to ToggleButton for processing*/}
                            <ActionForwarder
                                namespacePrefix="exampleApp/RandomGifPairPair"
                                pattern={RandomGif.actionTypes.NEW_GIF}
                                relativeDispatchPath="../ToggleButton/*"
                                transformer={Counter.actionTypes.INCREASE_COUNT}
                            />
                        </div>
                    </div>
                );
            }

            ReactDOM.render(
                <FractalComponent.AppContainerContext.Provider
                    value={appContainer}
                >
                    <App />
                </FractalComponent.AppContainerContext.Provider>,
                document.getElementById("app_root")
            );
        </script>
    </body>
</html>
```