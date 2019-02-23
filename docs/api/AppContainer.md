## AppContainer

- [`Overview`](#overview)
- [`Initialisation / Constructor`](#initialisation-constructor)
- [`Other Methods`](#other-methods)
    - [`deregisterComponent(component)`](#deregistercomponentcomponent)
    - [`destroy()`](#destroy)
    - [`subscribeActionDispatch`](#subscribeactiondispatch)
    - [`waitForActionsUntil`](#waitforactionsuntil)
    - [`dispatch`](#dispatch)
    - [`serialiseAction`](#serialiseaction)
    - [`deserialiseAction`](#deserialiseaction)


### Overview

`AppContainer` is the container holds the entire application's runtime state via a [Redux store](https://redux.js.org/). It also manages the application structure information via various `registries` including:
- `NamespaceRegistry`
- `ActionRegistry`
- `ComponentRegistry`
- `ReducerRegistry`
- `SagaRegistry`
- `SagaMonitorRegistry`

You will need at least one `AppContainer` for your App (For `Server-Side Rendering`, you may want to create more than one `AppContainer` to serve different requests). If you don't create an `AppContainer` for your App, the system will automatically create one for you when the [ComponentManager](./ComponentManager.md) tries to locate one during the `Component Manager` creation.

### `Initialisation / Constructor`

To create an `AppContainer`, you can simply:
```
import { AppContainer } from "fractal-component";
const appContainer = new AppContainer({
    ...containerConfigOptions
});
```

The constructor accepts the configOptions objects with the following options:
- `initState`: Optional; You can supply an object as the initial state data for the Redux store. This option is mainly used for `Server-Side Rendering` (SSR) --- when you want to restore the application state at client side from a Redux store snapshot (see [example SSR app](https://github.com/t83714/fractal-component/tree/master/examples/exampleAppSSR)).
- `reducer`: Optional; You can opt to supply a global [reducer](https://redux.js.org/basics/reducers) function that will be called after all component reducers. You highly unlikely need this as you can share always pack your global level logic into your component.
- `middlewares`: Optional; You can supply extra [Redux middlewares](https://redux.js.org/advanced/middleware) to be used by the `Redux store` created by `AppContainer`.
- `reduxDevToolsDevOnly`: Optional; Boolean; Default: `true`. Indicate whether [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) is allowed to connect to your App under `development` mode only. Set to `false` will allow your App to be connected under `production` mode as well.
- `devToolOptions`: Optional; You can further config the [Redux DevTools](https://github.com/zalmoxisus/redux-devtools-extension) that connects to your App via this option. More information of all available config options can be found from [here](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md)
- `sagaMiddlewareOptions`: Optional; You can specify the options of the `Saga Middleware` that is created for connecting the `Sagas` to the `Redux Store`. More information of all available config options can be found from [here](https://redux-saga.js.org/docs/api/#createsagamiddlewareoptions)


### `Other Methods`

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

#### `serialiseAction`

The method's type declaration is shown as below:

```typescript
serialiseAction(action: Action): string;
```

`fractal-component` requires `action type` to be [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) type. `symbol` type data usually cannot be serialised. However, `fractal-component` comes with a `ActionRegistry` to it possible.

This method can be used to serialise an action and return a JSON string.

#### `deserialiseAction`

The method's type declaration is shown as below:

```typescript
deserialiseAction(actionJson: string): Action;
```

This method accept `JSON string` and return an Action object.