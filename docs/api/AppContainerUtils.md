## AppContainerUtils

- [`Overview`](#overview)
- [`AppContainerUtils.createAppContainer`](#appcontainerutilscreateappcontainer)
- [`AppContainerUtils.getAppContainer`](#appcontainerutilsgetappcontainer)
- [`AppContainerUtils.registerComponent`](#appcontainerutilsregistercomponent)
- [`AppContainerUtils.deregisterComponent`](#appcontainerutilsderegistercomponent)
- [`AppContainerUtils.serialiseAction`](#appcontainerutilsserialiseaction)
- [`AppContainerUtils.deserialiseAction`](#appcontainerutilsdeserialiseaction)
- [`AppContainerUtils.updateAppContainerRetrieveKey`](#appcontainerutilsupdateappcontainerretrievekey)


### Overview

`AppContainerUtils` provides static methods that allows you to access the `AppContainer`'s fucntionality easily. You likely use `AppContainerUtils` more often rather than directly call any methods of an `AppContainer` instance. The reason is that all `AppContainerUtils` methods don't require the reference of an `AppContainer` instance. Instead, `AppContainerUtils` methods come with built-in logic locate the most appropriate `AppContainer` instance (that created at other part of application) at the time of calling --- this might not be critical for a single-`AppContainer` environment. However, it will be very important for `Server-Side Rendering` as you might want to keep different `AppContainer` instance to serve different requests. (see [example app](/examples/exampleAppSSR)). 

As such, it's recommend for a `Component` author to use `AppContainerUtils.registerComponent` to register `React Component` to an `AppContainer` to make sure the `Component` written can be re-used under different circumstances.

### `AppContainerUtils.createAppContainer`

You can use `AppContainerUtils.createAppContainer` to create an `AppContainer`:
```
import { AppContainerUtils } from "fractal-component";
const appContainer = AppContainerUtils.createAppContainer({
    ...containerConfigOptions
});
```
Information of the `containerConfigOptions` can be found from the document for [`AppContainer`](/docs/api/AppContainer.md#initialisation-constructor)

### `AppContainerUtils.getAppContainer`

The method's type declaration is shown as below: 

```typescript
export declare function getAppContainer(
    componentInstance?: ManageableComponent
): AppContainer;
```

Here `ManageableComponent` is a [React Class Component](https://reactjs.org/docs/components-and-props.html#functional-and-class-components).

`AppContainerUtils.getAppContainer` method accepts one optional `componentInstance` parameter and will try to locate an `AppContainer` instane in the following way:

- `componentInstance`'s `appContainer` property (i.e. `componentInstance.props.appContainer`) .It's configurable via `AppContainerUtils.updateAppContainerRetrieveKey()`
- Or `componentInstance.context.appContainer`
- Or Previous created `AppContainer` via [`AppContainerUtils.createAppContainer()`](#appcontainerutilscreateappcontainer) call.
- If can't find, it will auto create (using `AppContainerUtils.createAppContainer()`) a new `AppContainer` with default options. And return it.

All other `AppContainerUtils` method will use this method to locate an `AppContainer` instance if they need one.


### `AppContainerUtils.registerComponent`

You can use register a [React Class Component](https://reactjs.org/docs/components-and-props.html#functional-and-class-components) to the `AppContainer`. Once register, a `Component Container` is created behind the scenes to maintain a more advanced component structure as illustrated by [this diagram](https://raw.githubusercontent.com/t83714/fractal-component/master/docs/assets/container-structure.png).

More info can be found from the [AppContainer.registerComponent](/docs/api/AppContainer.md#registercomponent) document. 

The method's type declaration is shown as below: 

```typescript
export declare function registerComponent(
    componentInstance: ManageableComponent,
    options: ManageableComponentOptions
): void;
```

Here `ManageableComponent` is a [React Class Component](https://reactjs.org/docs/components-and-props.html#functional-and-class-components).

More information of the `ManageableComponentOptions` can be found from the [AppContainer.registerComponent](/docs/api/AppContainer.md#manageablecomponentoptions) document.

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

### `AppContainerUtils.deregisterComponent`

Deregister the `React Component` from the `AppContainer`. This method is automatically called when the React Component is unmounted.

The method's type declaration is shown as below: 

```typescript
export declare function deregisterComponent(
    componentInstance: ManageableComponent
): void;
```

Internally, `AppContainerUtils.deregisterComponent` calls `AppContainer.deregisterComponent`.


### `AppContainerUtils.serialiseAction`

This method will call `AppContainer`'s `ActionRegistry` to serialise an `Action`. `fractal-component` requires all action type is an [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) to avoid action type collision between different component. However, `Symbol` generally cannot be serialise directly via `JSON.stringify`. This may cause some troubles if you want to store actions and reply later to implment `time travel` or `undo` feature.

To overcome this issue, `fractal-component` provides an `ActionRegistry` facility to serialise an `Action`. 

The method's type declaration is shown as below:

```typescript
export declare function serialiseAction(
    action: Action,
    componentInstance?: ManageableComponent
): string;
```

It use `componentInstance` parameter to call `AppContainerUtils.getAppContainer()` to get an `AppContainer` instance. And then, call the `serialiseAction` method of the `ActionRegistry` owned by the `AppContainer` instance to serialise an `Action`.

You also can call `ActionRegistry.serialiseAction` directly if you have access to an `AppContainer` instance.

### `AppContainerUtils.deserialiseAction`

Deserialis an `Action`.

The method's type declaration is shown as below:

```typescript
export declare function deserialiseAction(
    actionJson: string,
    componentInstance?: ManageableComponent
): Action;
```

### `AppContainerUtils.updateAppContainerRetrieveKey`

`AppContainerUtils.getAppContainer()` by default will use key `appContainer` to look for an `AppContainer` instance from the `React Component`'s `properties` or `context`. 

You can, however, use this method to change the key to be used to look for a `appContainer` instance.

The method's type declaration is shown as below: 

```typescript
export declare function updateAppContainerRetrieveKey(newKey: string): string;
```