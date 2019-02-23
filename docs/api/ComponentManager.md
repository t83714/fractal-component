## ComponentManager

- [`Overview`](#overview)
- [`Key Properties`](#keyproperties)
- [`dispatch()`](#dispatch)
- [`getNamespaceData()`](#getnamespacedata)
- [`createClassNameGenerator()`](#createclassnamegenerator)

### Overview

An instance of `ComponentManager` will be created when register a `React Class or Function Component` to the [AppContainer](./AppContainer.md) via `new ComponentManager()` (for React Class Components) or [useComponentManager Hook](./useComponentManager.md) (for React Function Components). 

Once the `Component Manager` is created, a `Component Container` structure is created behind the scenes to maintain a more advanced component structure as illustrated by [this diagram](https://raw.githubusercontent.com/t83714/fractal-component/master/docs/assets/container-structure.png). After that, you no longer can call [`this.setState`](https://reactjs.org/docs/state-and-lifecycle.html) to update your react class component state. Instead, you should update your component state via `Component Reducer` (you can supply via [ManageableComponentOptions](./ManageableComponentOptions.md)) and system will auto sync between Redux store and your component state.

An instance of `ComponentManager` is responsible for:
- Locate [AppContainer](./AppContainer.md) instance and register itself to the located [AppContainer](./AppContainer.md) instance
  - `ComponentManager` will try to locate [AppContainer](./AppContainer.md) via:
    - [Component Props](https://reactjs.org/docs/components-and-props.html) `appContainer`
    - Or [Context](https://reactjs.org/docs/context.html)
    - Or an automatically created global shared default [AppContainer](./AppContainer.md)
- Create namespaced [Saga](https://redux-saga.js.org/), register it with `AppContainer` & [terminate / cancel](https://redux-saga.js.org/docs/api/#cancel) it when the component is unmounted
- Create, Hot plug namespaced [Reducer](https://redux.js.org/basics/reducers) with `AppContainer` & unplug it when the component is unmounted
- Register namespaced [Action](https://redux.js.org/basics/actions) so they can be serialised if necessary 
- Manage any other namespaced data

### Create Component Manager

#### Manage Class Component

Component Manager can be created by creating an instance of the ComponentManager class using `new` operator:

```
const componentManager = new ComponentManager(manageableComponent, manageableComponentOptions);
```

#### `ManageableComponent`

Here, `manageableComponent` is a [React Class Component](https://reactjs.org/docs/components-and-props.html#functional-and-class-components) instance. You can get the reference of the `React Class Component` as `this` within any of its class methods. However, in order to let `fractal-component` manage your component probably, you will need to create `Component Manager` in your component class's `constructor` method. e.g.:

```javascript
import React from "react";
import { ComponentManager, AppContainerContext } from "fractal-component";
class MyComponent extends React.Component {
    constructor(props) {
        this.componentManager = new ComponentManager(this, {
            // --- all manageableComponentOptions goes here. Details see next section
            ....
        });
    }
    render() {...}
}
// --- This allows ComponentManager to locate the `AppContainer` 
// --- via `React Context API` without using `Context.Consumer` component
MyComponent.contextType = AppContainerContext;
```

#### ManageableComponentOptions

More details of `ManageableComponentOptions` can be found from [here](./ManageableComponentOptions.md).

### Key Properties

You may need to access the following public properties of a `ComponentManager` instance:

- `namespace`: String. the `namespace` of the `Component Container`. e.g. `io.github.t83714/RandomGif`
- `componentId`: String. the auto-genereated `componentId`. e.g. `c0`
- `namespacePrefix`: String. the `namespacePrefix` of the `Component Container`. e.g. `ExampleApp/RandomGifDemo`
-  `fullPath`: String. `Full Namespace Path` of the `Component Container`. e.g. `ExampleApp/RandomGifDemo/io.github.t83714/RandomGif`
- `localPath`: String: `namesapce` + `ComponentId`. e.g. `io.github.t83714/RandomGif/c0`

### `dispatch()`

The method's type declaration is shown as below: 

```typescript
dispatch(action: Action, relativeDispatchPath?: string): Action;
```

You can use this method to dispatch namespaced actions:

```javascript
import React from "react";
import { ComponentManager } from "fractal-component";

class RandomGif extends React.Component {
    constructor(props) {
        super(props);
        this.componentManager = new ComponentManager(this, {
            namespace: "io.github.t83714/RandomGif"
        });
    }

    render() {
        return <button onClick={()=>{
            /*
            * Dispatch namespaced action:
            * The component's runtime local namespace path should be:
            * `io.github.t83714/RandomGif/xx` xx is an auto-generated ID
            * `../../../*` will make action to be dispatched just out of the container
            */
            this.componentManager.dispatch({}, "../../../*");
        }}>Click me!</button>;
    }
}

export default RandomGif;
```

In `saga`, you should use provided `put` `effects` to dispatch namespaced actions. See [ManageableComponentOptions / saga](./ManageableComponentOptions.md#option-saga).

### `getNamespaceData()`

The method's type declaration is shown as below: 

```typescript
getNamespaceData(): any;
```

`fractal-component` comes with a `NamespaceRegistry` that allows you store some data for the `Component`'s `namespace` (e.g. `io.github.t83714/RandomGif`). Later, you can retrieve the data from all component instances. 

One common use case of store `namespace` level data is to create / store JSS stylesheet only once and retrieve this stylesheet from all component instances.

See [ManageableComponentOptions / namespaceInitCallback](./ManageableComponentOptions.md#option-namespaceinitcallback).

### `createClassNameGenerator()`

The method's type declaration is shown as below: 

```typescript
createClassNameGenerator(): () => string;
```

This is a helper method return a `Class Name Generator` function used by [JSS](https://github.com/cssinjs/jss/blob/master/docs/js-api.md#create-style-sheet) to create class names that won't collided with any other components. The generated class names are guaranteed to be the same for the same component instance in the same application. This solves the Server-Side Rendering (SSR) hydrated style sheets mismatach issue as React 16 won't patch up the mismatch className attribute (or [any mistach attributes](https://reactjs.org/docs/react-dom.html#hydrate)) during the hydratation.  