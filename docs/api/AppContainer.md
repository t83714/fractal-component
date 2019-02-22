## AppContainer

- [`Overview`](#overview)
- [`Initialisation / Constructor`](#initialisation-constructor)
    - [`AppContainerUtils.createAppContainer()`](#appcontainerutilscreateappcontainer)
- [`Other Methods`](#other-methods)
    - [`registerComponent`](#registercomponent)
        - [`ManageableComponentOptions`](#manageablecomponentoptions)
    - [`deregisterComponent(component)`](#deregistercomponentcomponent)
    - [`destroy()`](#destroy)
    - [`subscribeActionDispatch`](#subscribeactiondispatch)
    - [`waitForActionsUntil`](#waitforactionsuntil)
    - [`dispatch`](#dispatch)


### Overview

`AppContainer` is the container holds the entire application's runtime state via a [Redux store](https://redux.js.org/). It also manages the application structure information via various `registries` including:
- `NamespaceRegistry`
- `ActionRegistry`
- `ComponentRegistry`
- `ReducerRegistry`
- `SagaRegistry`
- `SagaMonitorRegistry`

You will need at least one `AppContainer` for your App (For `Server-Side Rendering`, you may want to create more than one `AppContainer` to serve different requests). If you don't create an `AppContainer` for your App, the system will automatically create one for you when you first time call `AppContainerUtils.registerComponent()` to register a [`React`](https://reactjs.org/) component.

### `Initialisation / Constructor`

To create an `AppContainer`, you can simply:
```
import { AppContainer } from "fractal-component";
const appContainer = new AppContainer({
    ...containerConfigOptions
});
```

The constructor accepts the configOptions objects with the following options:
- `initState`: Optional; You can supply an object as the initial state data for the Redux store. This option is mainly used for `Server-Side Rendering` (SSR) --- when you want to restore the application state at client side from a Redux store snapshot (see [example app](https://github.com/t83714/fractal-component/tree/master/examples/exampleAppSSR)).
- `reducer`: Optional; You can opt to supply a global [reducer](https://redux.js.org/basics/reducers) function that will be called after all component reducers. You highly unlikely need this as you can share always pack your global level logic into a `container`.
- `middlewares`: Optional; You can supply extra [Redux middlewares](https://redux.js.org/advanced/middleware) to be used by the `Redux store` created by `AppContainer`.
- `reduxDevToolsDevOnly`: Optional; Boolean; Default: `true`. Indicate whether [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) is allowed to connect to your App under `development` mode only. Set to `false` will allow your App to be connected under `production` mode as well.
- `devToolOptions`: Optional; You can further config the [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) that connects to your App via this option. More information of all available config options can be found from [here](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md)
- `sagaMiddlewareOptions`: Optional; You can specify the options of the `Saga Middleware` that is created for connecting the `Sagas` to the `Redux Store`. More information of all available config options can be found from [here](https://redux-saga.js.org/docs/api/#createsagamiddlewareoptions)

#### `AppContainerUtils.createAppContainer()`

You likely will not create `AppContainer` in this way when you only need one `AppContainer`. Instead, you will want to use static method `AppContainerUtils.createAppContainer()` to create `AppContainer`. e.g.:

```
import { AppContainerUtils } from "fractal-component";
const appContainer = AppContainerUtils.createAppContainer({
    ...containerConfigOptions
});
```
`AppContainerUtils.createAppContainer()` calls `new AppContainer()` internally to create `AppContainer`. The reason why you want to use this static method verion is that it will store newly created `AppContainer` internally. And then other methods provided by `AppContainerUtils` will subsequently have access to this `AppContainer` without your explicitly passing around the reference.


### `Other Methods`

#### `registerComponent`
```
registerComponent(
    componentInstance: ManageableComponent,
    options?: ManageableComponentOptions
): ComponentManager;
```

`registerComponent` is used to register a [React Class Component](https://reactjs.org/docs/components-and-props.html#functional-and-class-components). Once registered, a `Component Manager` is created to manage this `React Class Component` and a `Component Container` is created behind the scenes to maintain a more advanced component structure as illustrated by [this diagram](https://raw.githubusercontent.com/t83714/fractal-component/master/docs/assets/container-structure.png). After that, you no longer can call [`this.setState`](https://reactjs.org/docs/state-and-lifecycle.html) to update your react component state. Instead, you should update your component state via `Component Reducer` (you can supply via `ManageableComponentOptions`) and system will auto sync between Redux store and your component state.

You likely will not call this method directly. Instead, you may want to use static method `AppContainerUtils.registerComponent()`. It calls `appContainer.registerComponent()` internally to provide similar function. Moreover, calling `AppContainerUtils.registerComponent()` doesn't require the reference of `AppContainer` instance. It will automatically look for `appContainer` from:

- Current `React Component` `props.appContainer` (It's configurable via `AppContainerUtils.updateAppContainerRetrieveKey()`)
- React context data.
- Previous created `AppContainer` via [`AppContainerUtils.createAppContainer()`](./AppContainerUtils.md#appcontainerutilscreateappcontainer) call.
- If can't find, it will auto create (using `AppContainerUtils.createAppContainer()`) a new `AppContainer` with default options.


Example:
```javascript
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
            ...
        };
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714/Counter",
            ...
        });
    }
    render() {
        return <div>{this.state.count}<div>
    }
}
```


##### `ManageableComponentOptions`

The following options can be used to config the `Component Container` created via `registerComponent()` method:

- `saga`: Optional; You can supply a [Generator Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) to run as a concurrent process. You can use it to run an event loop or managing side-effects. We internally use [redux-saga](https://redux-saga.js.org/) to run your `saga`. 

Your will `saga` be supplied one parameter `effects` which contains a list of `effect creator` functions. Those `effect creator` functions return an object `effect description` of what needs to be done rather than create the effect immediately. The `effect description` object will be sent to underlayer `saga` processor when you [yield](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield) the `effect description` object. The underlayer `saga` processor will then create the effect, monitor its process and resume your `saga` (the [Generator Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)) with possible result (through the return value of `yield` operator) once it's completed. 

The `effect creator` functions provided by `effects` parameter provide the same function as [redux-saga](https://redux-saga.js.org/docs/api/#saga-helpers). The only difference is that any action related `effect creators` are namespaced. i.e. you only have access to actions that are dispatched to your component `Full Namespace Path` and the actions dispatched (i.e. using `put` effect) are also namespaced. Here is a list of key `effect creators` and full list of available `effect creators` can refer to the [redux-saga API document](https://github.com/redux-saga/redux-saga/tree/v1.0.0-beta.2/docs/api):
  - `take(pattern)`
    - Take an action action with certain [pattern](https://github.com/redux-saga/redux-saga/tree/v1.0.0-beta.2/docs/api#takepattern).
  - `put(action: Action, relativeDispatchPath: string)`
    - Dispatch an action. The action is, by default, considered as dispatched from the component `Full namespace path`. You can supply an optional `relativeDispatchPath` parameter to alter the default dispatch position on the [Namespace Tree](../Introduction/BeginnerTutorial/RandomGif/Namespace.md#321-namespace-tree--action-dispatch).
  - `select(selector?: (state: any, ...args: any[]) => any, ...args: any[])`
    - Get current state in store and return it or return the result an optional selector function involved on it.
  - `takeEvery(pattern, childSaga, ...args: any[])`
  - `takeLatest(pattern, childSaga, ...args: any[])`
  - `takeLeading(pattern, childSaga, ...args: any[])`
  - `throttle(mileseconds, pattern, childSaga, ...args: any[])`
  - `debounce(mileseconds, pattern, childSaga, ...args: any[])`
  - `actionChannel(pattern, buffer)`

Here is a sample saga:
```javascript
function*(effects) {
    // --- while(true) won't freeze your UI as your function will not continue to run
    // --- until the effect is resolved. 
    while(true){
        const action = yield effects.take(actionTypes.REQUEST_NEW_GIF);
        yield effects.put(actions.loadingStart(), "../../../*");
    }
};
```
- `initState`: Optional; Used as intial state of the component. You can normally set component initial state in react component constructor via `this.state={...}` in which case you don't need this. 
- `reducer`: Optional; A reducer for updating component state. This reducer will only see its component state in redux store and only be called when an action is dispatched to the component namespace.
- `namespace`: String; e.g. `io.github.t83714/Counter` It's recommended to use a domain name, a `/` seperator and a menaingful Component name to create the namespace. 
- `namespacePrefix`: Optional; String; You normally will not set this option as a component author. It will be used by Componnent user to pass extra namepsace path to attach your component to a `namespace tree`. It will impact how multicast actions are dispatched.
- `componentId`: Optional; String; You normally don't need to set this. And system will be auto create a componentId for every component. `namespacePrefix`, `namespace` plus `componentId` are made up of a component's full namespace path in a `namespace tree`.
- `persistState`: Optional; Boolean; Default: `true`; whether reset the current state if it's not empty during the `Component Container` initialisation. 
- `actionTypes`: Optional; Array; Provide all action types supported by your component;
- `allowedIncomingMulticastActionTypes`: Optional; Specify which actionTypes are allowed to be dispatched to this component. By Default, the component will not accept any incoming multicast actions. (Direct address actions will still be delivered). when `allowedIncomingMulticastActionTypes` is string only "*" is accepted (means accepting any actionTypes).
- `namespaceInitCallback`: Optional; `Function`; namespaceInitCallback & namespaceDestroyCallback will be called once (among all component instances of the same namespace). It's used for required one-off initlalisation job for all same type component (of the same namespace). e.g. create JSS style sheet for the component. `namespaceInitCallback` is called when Component namespace has just been created. i.e. at least one Component is created & mounted.
- `namespaceDestroyCallback`: Optional; `Function`; Called when component namespace is destroyed. All components of the namespace are unmounted / destroyed.

Example for `namespaceInitCallback` & `namespaceInitCallback`
```javascript
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ... };
        this.styleSheet = null;
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714/Counter",
            reducer: function(state, action) { ... },
            actionTypes,
            allowedIncomingMulticastActionTypes: [actionTypes.INCREASE_COUNT],
            // --- `namespaceInitCallback` is guaranteed only to be called once
            namespaceInitCallback: componentManager => {
                const styleSheet = jss
                    .createStyleSheet(styles, {
                        generateClassName: componentManager.createClassNameGenerator()
                    })
                    .attach();
                return { styleSheet };
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
                <div className={classes.cell}>Counter</div>
                <div
                    className={`${classes.cell} ${
                        classes["counter-container"]
                    }`}
                >
                    <span>{this.state.count}</span>
                </div>
            </div>
        );
    }
}
```

#### `deregisterComponent(component)`

Deregister the React Component from `AppContainer`. This method is automatically called when the React Component is unmounted.

#### `destroy()`

Destroy `AppContainer`. Mainly for use cases when you need to create more than one `AppContainers`. e.g. Server-Side Rendering (SSR).

#### `subscribeActionDispatch`

The method's type declaration is shown as below:

```typescript
subscribeActionDispatch(func: (Action) => void): void;
```

This method is mainly used for Server-Side Rendering (SSR). i.e. To decide to when the initial data loading is finised and when it is ready to create a snapshot of the redux store via `appContainer.store.getState()` You shouldn't need it for implmenting any logic. 
#### `waitForActionsUntil`

The method's type declaration is shown as below:

```typescript
waitForActionsUntil(
    testerFunc: (Action) => boolean,
    timeout?: number
): Promise<void>;
```

An utility mainly designed for Server-Side Rendering (SSR). see [example app](https://github.com/t83714/fractal-component/tree/master/examples/exampleAppSSR)

#### `dispatch`

The method's type declaration is shown as below:

```typescript
dispatch(action: Action, relativeDispatchPath?: string): Action;
```

This method is mainly used for Server-Side Rendering (SSR). i.e. Send out actions (if necessary) to trigger initial data loading. You shouldn't need it for implmenting any logic. see [example app](https://github.com/t83714/fractal-component/tree/master/examples/exampleAppSSR)
