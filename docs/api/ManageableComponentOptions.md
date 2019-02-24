## `ManageableComponentOptions`

`ManageableComponentOptions` is a plain javascript object with keys of configuration options can be used to config the behaviour & functionality of the [ComponentManager](./ComponentManager.md) that created to manage your React Component. 

You can supply `ManageableComponentOptions` when you create an instance of [ComponentManager](./ComponentManager.md) via `new` operator directly (for `React Class Component`) or [useComponentManager Hook](./useComponentManager.md) (for `React Function Component`).

Available options are:

### Option `saga`

This is an optional config option.

Conceptually, a `Saga` is like a separate thread created for your component to run an event loop or managing side-effects. Through this option, you can supply a [Generator Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) (or we call `Component Main Saga`) to run as a concurrent process. Although, we still physically run in a signle thread environment, the `saga` model allows us to [block](https://redux-saga.js.org/docs/api/takepattern) a `saga` when wait for a event / action without blocking other javascript code execution or [fork](https://redux-saga.js.org/docs/api/forkfn-args) a new `saga` to create side effects concurrently. We internally use [redux-saga](https://redux-saga.js.org/) to run your `saga`. 

Your `saga` will be supplied one parameter `effects` which contains a list of `effect creator` functions. Those `effect creator` functions return an object `effect description` of what needs to be done rather than create the effect immediately. The `effect description` object will be sent to underlayer `saga` processor when you [yield](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield) the `effect description` object. The underlayer `saga` processor will then create the effect, monitor its process and resume your `saga` (the [Generator Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*)) with possible result (through the return value of `yield` operator) once it's completed. 

The `effect creator` functions provided by `effects` parameter provide the same function as [redux-saga](https://redux-saga.js.org/docs/api/#saga-helpers). The only difference is that any action related `effect creators` are namespaced. i.e. you only have access to actions that are dispatched to your component `Full Namespace Path` and the actions dispatched (i.e. using `put` effect) are also namespaced. Here is a list of key `effect creators` and full list of available `effect creators` can refer to the [redux-saga API document](https://redux-saga.js.org/docs/api/takepattern):
  - `take(pattern)`
    - Take an action action with certain [pattern](https://redux-saga.js.org/docs/api/#takepattern).
  - `put(action: Action, relativeDispatchPath?: string)`
    - Dispatch an action. The action is, by default (when omit the `relativeDispatchPath` parameter), considered as dispatched from the component `Full Namespace Path` (i.e. the component itself can receive it). You can supply an optional `relativeDispatchPath` parameter to alter the default dispatch position on the [Namespace Tree](../Introduction/BeginnerTutorial/RandomGif/Namespace.md#321-namespace-tree--action-dispatch).
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
import { cancelled } from "redux-saga/effects"
function*(effects) {
    try {
        /**
         * Safe to perform any side effects, monitor any actions 
         * or setup subscription here.
         * You can also fork a new Saga to handle side effects / error concurrently
         * to avoid letting main saga exit.
        */
    } catch (e) {
        // --- optional handle any errors here
    } finally {
        /**
         * When your component is unmonted, your saga will be cancelled.
         * Code will reach the finally block and you can test 
         * whether the saga is cancelled by `yield cancelled()` effects
        */
        if (yield cancelled()) {
            // --- logic that should execute only on cancellation
        } else {
            // --- logic that should execute in all situations
        }
    }
};
```

### Option `initState`

Optional; 

Used as intial state of the component. You can also set component initial state in react class component constructor via `this.state={...}` in which case you don't need this. For react function component, it's the only way to set the initial component state.

### Option `reducer`

Optional; 

A reducer for updating component state. This reducer will only see its component state in redux store and only be called when an action is dispatched to the component namespace. You will always want to supply this option when you need component state as the `reducer` is the only way to alter component state.

### Option `namespace`

String; 

e.g. `io.github.t83714/Counter` It's recommended to use a domain name, a `/` seperator and a menaingful Component name to create the namespace. 

### Option `namespacePrefix`

Optional; String; 

If you are the component author, you pronbably never need to set this option. It will be used by the componnent user to pass extra namepsace path to attach your component to a designated position on the `namespace tree`. It will impact how multicast actions are dispatched & received.

All managed components will accept a `namespacePrefix` component `props`. The value of this `props` will overwrite the `namespacePrefix` option here during the [ComponentManager](./ComponentManager.md) creation. This allows your component users to customise / config your component action dispatch behaviour.

### Option `componentId`

Optional; String; 

You normally don't need to set this. And system will be auto create a componentId for every component. `namespacePrefix`, `namespace` plus `componentId` are made up of a component's full namespace path in a `namespace tree`.

### Option `persistState`

Optional; Boolean; 

Default: `true`; whether reset the current state if it's not empty during the [ComponentManager](./ComponentManager.md) creation.

### Option `actionTypes`

Optional; Array of [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol); 

Provide all action types defined by your component; 

Actions with symbol action type are not serializable. Supply this option here allows [ComponentManager](./ComponentManager.md) to register all your action symbol types. Consequently, make them serializable through 

### Option `allowedIncomingMulticastActionTypes`

Optional; 

Specify which actionTypes are allowed to be dispatched to this component. By Default, the component will not accept any incoming multicast actions. (Direct address actions will still be delivered). when `allowedIncomingMulticastActionTypes` is string only "*" is accepted (means accepting any actionTypes).

### Option `namespaceInitCallback`

Optional; `Function`; 

namespaceInitCallback & namespaceDestroyCallback will be called once (among all component instances of the same namespace). It's used for required one-off initlalisation job for all same type component (of the same namespace). e.g. create JSS style sheet for the component. `namespaceInitCallback` is called when Component namespace has just been created. i.e. at least one Component is created & mounted.

### Option `namespaceDestroyCallback`

Optional; `Function`; 

Called when component namespace is destroyed. All components of the namespace are unmounted / destroyed.

Example for `namespaceInitCallback` & `namespaceInitCallback`
```javascript
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ... };
        this.styleSheet = null;
        this.componentManager = new ComponentManager(this, {
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