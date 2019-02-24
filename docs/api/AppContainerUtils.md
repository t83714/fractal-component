## AppContainerUtils

- [`Overview`](#overview)
- [`AppContainerUtils.createAppContainer`](#appcontainerutilscreateappcontainer)
- [`AppContainerUtils.getAppContainer`](#appcontainerutilsgetappcontainer)
- [`AppContainerUtils.updateAppContainerRetrieveKey`](#appcontainerutilsupdateappcontainerretrievekey)


### Overview

`AppContainerUtils` provides static methods that provides an alternative option to access the `AppContainer`'s fucntionality (with extra functionality of locating AppContainer). It's recommended that you use the APIs provided by [ComponentManager](./ComponentManager.md), [useComponentManager](./useComponentManager.md) or [AppContainer](./AppContainer.md) directly rather APIs here.

### `AppContainerUtils.createAppContainer`

You can use `AppContainerUtils.createAppContainer` to create an `AppContainer`:
```
import { AppContainerUtils } from "fractal-component";
const appContainer = AppContainerUtils.createAppContainer({
    ...containerConfigOptions
});
```
Information of the `containerConfigOptions` can be found from the document for [`AppContainer`](./AppContainer.md#initialisation-constructor)

**Please note:**

`AppContainerUtils.createAppContainer` will only create an instance of `AppContainer` on the first call. Subsequent calls will always return the previous created `AppContainer` instance. 


### `AppContainerUtils.getAppContainer`

The method's type declaration is shown as below: 

```typescript
export declare function getAppContainer(
    componentInstance?: ManageableComponent
): AppContainer;
```

Here `ManageableComponent` is a [React Class Component](https://reactjs.org/docs/components-and-props.html#functional-and-class-components).

`AppContainerUtils.getAppContainer` method accepts one optional `componentInstance` parameter and will try to locate an `AppContainer` instane in the following way:

- `componentInstance`'s `appContainer` component [props](https://reactjs.org/docs/components-and-props.html). It's configurable via `AppContainerUtils.updateAppContainerRetrieveKey()`
- Or [Context](https://reactjs.org/docs/context.html)
- Or return an `AppContainer` instance via [`AppContainerUtils.createAppContainer()`](#appcontainerutilscreateappcontainer) call.

All other `AppContainerUtils` method will use this method to locate an `AppContainer` instance if they need one.

[ComponentManager](./ComponentManager.md) use this function for locating `AppContainer` instance during the initialisation as well. 


### `AppContainerUtils.updateAppContainerRetrieveKey`

`AppContainerUtils.getAppContainer()` by default will use key `appContainer` to look for an `AppContainer` instance from the [React Component Props](https://reactjs.org/docs/components-and-props.html). 

You can, however, use this method to change the key to be used to look for a `appContainer` instance.

The method's type declaration is shown as below: 

```typescript
export declare function updateAppContainerRetrieveKey(newKey: string): string;
```