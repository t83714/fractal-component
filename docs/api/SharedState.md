## SharedState

- [`Overview`](#overview)
- [`Define Shared State`](#define-shared-state)
- [`Use Shared State`](#use-shared-state)
- [`Example App`](#example-app)

### Overview

`fractal-component` allows you to encapsulate the component state data in a namespace container. However, sometimes, you may want to share state data among encapsulated components. `SharedState` allows you to define a piece of state data with its own reducer and share it with other components. `fractal-component` handles the sharing & mapping process in a transparent way. i.e. the shared state data will be mapped into target component local state data automacally as if it was part of the component original state data. In the meantime. there is only one copy of the shared state data stored in the global redux store.

Like component state data, you can only update shared state data via its own namespaced reducer by dispatching action defined in the `SharedState`'s namespace (i.e. the target component reducer can't see the shared state data). To make it easier to deliver action to the `SharedState`'s namespace, if you dispatch an action that defined by the `SharedState` state without specifying the [dispatch path](./ComponentManager.md#dispatch), the action will be delivered to the `SharedState`'s reducer directly.

`SharedState` requires `fractal-component` `4.3.0` or higher.

### Define Shared State

You can define `SharedState` by `createSharedState()` function. 

Here is an example:

```javascript
import { createSharedState } from "fractal-component";
import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import reducer from "./reducers";

const SharedStateA = createSharedState({
    // --- the namespace of the shared state container
    namespace: "io.github.t83714/SharedStateA",
    // --- all action types defined by the shared state container
    actionTypes,
    // --- the shared state reducer
    reducer,
    // --- initial state data of the sahred state
    initState: {
        b: 2
    }
});

export default SharedStateA;
export { actionTypes, actions };
```

### Use Shared State


You can specify SharedState that you want to be mapped into your component when create the component via [sharedStates](./ManageableComponentOptions#option-sharedstates) option. 

Here is an example:

```javascript
import { ComponentManager, AppContainerContext } from "fractal-component";
class ComponentA extends React.Component {
    constructor(props) {
        super(props);
        this.state = initState();
        this.componentManager = new ComponentManager(this, {
            namespace: "io.github.t83714/ComponentA",
            initState: {
                a: 1
            },
            sharedStates: {
                SharedStateA
            }
        });
    }

    render() {
        /**
         * this.state will be 
         * {
         *   a: 1,
         *   SharedStateA: {
         *     b: 2
         *   }
         * }
        */
    }
}
ComponentA.contextType = AppContainerContext;
```

Or use `userComponentManager` hook to define a function component:
```javascript
import { useComponentManager } from "fractal-component";

const ComponentA = props => {
    const [state, dispatch] = useComponentManager(props, {
        namespace: "io.github.t83714/ComponentA",
        initState: {
            a: 1
        },
        sharedStates: {
            SharedStateA
        }
    });

    /**
     * state will be 
     * {
     *   a: 1,
     *   SharedStateA: {
     *     b: 2
     *   }
     * }
    */

    return <div>test</div>;
};

export default createComponentA;
```

### Example App

An example app can be found from [here](https://github.com/t83714/fractal-component/tree/master/examples/exampleAppSharedState)

