## ComponentManager

- [`Overview`](#overview)
- [`Key Properties`](#keyproperties)
- [`dispatch()`](#dispatch)
- [`getNamespaceData()`](#getNamespaceData)
- [`createClassNameGenerator()`](#createClassNameGenerator)


### Overview

An instance of `ComponentManager` will be created when register a `React Class Component` to `AppContainer` via [AppContainerUtils.registerComponent](./AppContainerUtils.md#appcontainerutilsregistercomponent) or [AppContainer.registerComponent](./AppContainer.md#registercomponent). You will also get the ref to the newly created `ComponentManager` instance when calls any of the two `registerComponent` methods above.

You can use this ref to access current namespace information (e.g. `Full Namespace Path` etc.) or dispatch namespaced actions.

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
import { AppContainerUtils } from "fractal-component";

class RandomGif extends React.Component {
    constructor(props) {
        super(props);
        this.componentManager = AppContainerUtils.registerComponent(this, {
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

In `saga`, you should use provided `put` `effects` to dispatch namespaced actions. See [AppContainer / ManageableComponentOptions / saga](./AppContainer.md#manageablecomponentoptions).

### `getNamespaceData()`

The method's type declaration is shown as below: 

```typescript
getNamespaceData(): any;
```

`fractal-component` comes with a `NamespaceRegistry` that allows you store some data for the `ComponentContainer`'s `namespace` (Not runtime `Full Namespace`. e.g. `io.github.t83714/RandomGif`). Later, you can retrieve the data from all component instances. 

One common use case of store `namespace` level data is to create / store JSS stylesheet only once and retrieve this stylesheet from all component instances.

See [AppContainer / ManageableComponentOptions / namespaceInitCallback](./AppContainer.md#manageablecomponentoptions).

### `createClassNameGenerator()`

The method's type declaration is shown as below: 

```typescript
createClassNameGenerator(): () => string;
```

This is a helper method return a `Class Name Generator` function used by [JSS](https://github.com/cssinjs/jss/blob/master/docs/js-api.md#create-style-sheet) to create class names that won't collided with any other components. The generated class names are guaranteed to be the same for the same component instance in the same application. This solves the Server-Side Rendering (SSR) hydrated style sheets mismatach issue as React 16 won't patch up the mismatch className attribute (or [any mistach attributes](https://reactjs.org/docs/react-dom.html#hydrate)) during the hydratation.  