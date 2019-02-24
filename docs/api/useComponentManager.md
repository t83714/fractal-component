## useComponentManager

`useComponentManager` is a [custom React Hook](https://reactjs.org/docs/hooks-custom.html) built with [React Hook APIs](https://reactjs.org/docs/hooks-reference.html) (available from React v16.8.0). It offers an easier way to package all logic and create an reusable component from a [React Function Component](https://reactjs.org/docs/components-and-props.html#function-and-class-components). `useComponentManager` is available from `fractal-component` v4.1.0

```
const [
    state, 
    dispatch, 
    getNamespaceData, 
    componentManager
] = useComponentManager(props, options);
```

Once called in a `React Function Component`, it will return the followings:
- state: return the reference of the component state.
- dispatch: A dispatch function that can be used to dispatch namespaced actions. It is a bound version of [ComponentManager.dispatch](./ComponentManager.md#dispatch) with exactly same functionality.
- getNamespaceData: A function that get be used to retrieve the namespace data that may created by [namespaceInitCallback](./ManageableComponentOptions.md#option-namespaceinitcallback). It is a bound version of [ComponentManager.getNamespaceData](./ComponentManager.md#getnamespacedata) with exactly same functionality.
- componentManager: The reference of the created [ComponentManager](./ComponentManager.md) instance. Like React's [useState](https://reactjs.org/docs/hooks-state.html) hook, `useComponentManager` hook will only create the `ComponentManager` once during the react function component lifecycle. Further calls untill the component is `unmounted` will return the same `ComponentManager` instance for the same component instance.


In fact, `useComponentManager` hook's return value can be used for either Object or Array destructuring assignment. i.e. you can either:

- `const [state, dispatch, getNamespaceData, componentManager] = useComponentManager(props, options)`
- OR `const { state, dispatch, getNamespaceData, componentManager } = useComponentManager(props, options)`

It might be convenient to use Object destructuring assignment when you want to omit one or more return values.

### Parameters

The `props` is the component `props`.

The `options` is a `ManageableComponentOptions`. More details can be found from [here](./ManageableComponentOptions.md).


### Example

Here is a exmaple component (A complete [example App](https://github.com/t83714/fractal-component/tree/master/examples/exampleAppHooks) built with `useComponentManager` hook can be found [here](https://github.com/t83714/fractal-component/tree/master/examples/exampleAppHooks)):

```javascript
import React from "react";
import PropTypes from "prop-types";
import { useComponentManager, AppContainer } from "fractal-component";
import * as actionTypes from "./actions/types";
import * as actions from "./actions/index";
import jss from "jss";
import jssDefaultPreset from "jss-preset-default";
import styles from "./styles";

function Counter(props) {
    
    const { state, getNamespaceData } = useComponentManager(props, {
        initState: {
            count: 0
        },
        namespace: "io.github.t83714/Counter",
        reducer: function(state, action) {
            switch (action.type) {
                case actionTypes.INCREASE_COUNT: {
                    const { toggleButtonActive } = action;
                    const incresement =
                        state.count >= 10 && toggleButtonActive ? 2 : 1;
                    return { ...state, count: state.count + incresement };
                }
                default:
                    return state;
            }
        },
        /**
         * Register actions for action serialisation / deserialisation.
         * It's much easier to use Symbol as action type to make sure no action type collision among different component.
         * ( Considering we now use actions as primary way for inter-component communication, it's quite important in a multicaset action environment)
         */
        actionTypes,
        // --- specify accepted types of external multicast actions
        // --- By default, component will not accept any incoming multicast action.
        // --- No limit to actions that are sent out
        allowedIncomingMulticastActionTypes: [actionTypes.INCREASE_COUNT],
        // --- `namespaceInitCallback` is guaranteed only to be called once
        namespaceInitCallback: componentManager => {
            let jssRef;
            if (!props.styles) {
                // --- if use built-in style, we want to make sure this component use its own jss setting
                jssRef = jss.setup(jssDefaultPreset());
            } else {
                jssRef = jss;
            }
            const styleSheet = jssRef
                .createStyleSheet(props.styles ? props.styles : styles, {
                    generateClassName: componentManager.createClassNameGenerator()
                })
                .attach();
            return { styleSheet };
        },
        namespaceDestroyCallback: ({ styleSheet }) => {
            styleSheet.detach();
        }
    });

    const { styleSheet } = getNamespaceData();
    const { classes } = styleSheet;

    return (
        <div className={classes.table}>
            <div className={classes.cell}>Counter</div>
            <div className={`${classes.cell} ${classes["counter-container"]}`}>
                <span>{state.count}</span>
            </div>
        </div>
    );
}

Counter.propTypes = {
    styles: PropTypes.object,
    appContainer: PropTypes.instanceOf(AppContainer)
};

export default Counter;

export { actionTypes, actions };
```