# Recommended Component Structure

## File Structure

Below is the recommended way of originsing your component files.

```
MyComponent/
├── actions/
├── reducers/
├── sagas/
|── styles/
└-- index.js
```
The `index.js` is the entry point of your component (it's also the [main file](https://docs.npmjs.com/files/package.json#main) when we publish the component as a NPM module). We normaly define the React Component in `index.js` and it also includes all visual presentation in [JSX](https://reactjs.org/docs/introducing-jsx.html) in this file (unless it's a component that comes with very complicated presentation. In which case, you probably want to seperate your JSX code into different files). All other folders will contians:
- `actions` folder : contains action type definitions & action creation functions
- `reducers` folder: contains namespaced reducer functions.  A reducer function will transite component state to next state depends on the actions received.
- `sagas` folder: contains namespaced sagas. A saga is a [generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) that yields [redux-saga effects](https://redux-saga.js.org/docs/basics/DeclarativeEffects.html). You can consider `redux-saga` effects as command desciptions that to be executed at later time by `redux-saga`. Sagas are used for managing component [action / event loop](https://en.wikipedia.org/wiki/Event_loop) and managing effects (e.g. send network requests etc.)
- `styles` folder: contains [`in-component` styls / CSS](https://github.com/cssinjs/jss/blob/master/docs/json-api.md) that managed by lib [JSS](https://github.com/cssinjs/jss). You also can use traditional global CSS stylsheet to style your component. However, use the approach recommended here will make your component fully independent, plus you also get other [benefits](http://cssinjs.org/benefits/)

## ES6 Module Export

Your component entry point `index.js` should export the followings:
- React Class Component: 
    - the Main React Component that is registered to `AppContainer` via `AppContainerUtils.registerComponent`
- Exposed Action Types: 
    - the types of actions may be sent out by this component
- Exposed Action Creation Functions:
    - the action creation functions that are used to create actions that are accepted by this component.

Examples:

```javascript
import * as actionTypes from "./actions/types";
import * as actions from "./actions/index";

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ... };
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714/Counter",
            reducer: function(state, action) {
                ...
            },
            actionTypes,
            allowedIncomingMulticastActionTypes: [actionTypes.INCREASE_COUNT]
        });
    }

    render() {
        ...
    }
}

// --- export `Main React Component`
export default Counter;

// --- export `Exposed Action Types` & `Exposed Action Creation Functions`
export { actionTypes, actions };
```