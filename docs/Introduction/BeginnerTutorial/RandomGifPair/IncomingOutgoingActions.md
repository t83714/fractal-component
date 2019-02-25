### 4.2 Incoming / Outgoing Actions

Similar to `RandomGif`, we need to define Incoming / Outgoing Actions as external programming interfaces so that component users can interact with the component programmingly easily (in `src/RandomGifPair/actions/types.js`):
``` javascript
// --- Incoming Action. External user can send this action to trigger Gif Pair loading
export const REQUEST_NEW_PAIR = Symbol("REQUEST_NEW_PAIR");
// --- Out-going actions.
// --- Dispatch when loading starts
export const LOADING_START = Symbol("LOADING_START");
// --- Dispatch when loading complete
export const LOADING_COMPLETE = Symbol("LOADING_COMPLETE");
```

And, we can define the following action creator functions accordingly (in `src/RandomGifPair/actions/index.js`):
```javascript
import * as actionTypes from "./types";

export function requestNewPair() {
    return {
        type: actionTypes.REQUEST_NEW_PAIR
    };
}

export function loadingStart() {
    return {
        type: actionTypes.LOADING_START
    };
}

export function loadingComplete(error = null) {
    return {
        type: actionTypes.LOADING_COMPLETE,
        payload: {
            isSuccess: error ? false : true,
            error
        }
    };
}
```

#### 4.2.1 `REQUEST_NEW_PAIR` action

To support `REQUEST_NEW_PAIR`, we firstly need to modify the `onClick` handler of the `Get Gif Pair` button to the following:
```jsx
<button
    onClick={() => {
        this.componentManager.dispatch(
            actions.requestNewPair()
        );
    }}
    disabled={this.state.isLoading}
>
```

Then, we need to create `saga` (in `src/RandomGifPair/sagas/index.js`) as the followings:

```javascript
import * as actions from "../actions";
import * as actionTypes from "../actions/types";
import {
    actions as RandomGifActions,
    actionTypes as RandomGifActionTypes
} from "../../RandomGif";

function* mainSaga(effects) {
    // --- monitor `REQUEST_NEW_PAIR` and send multicast actions to RandomGifs
    yield effects.takeEvery(
        actionTypes.REQUEST_NEW_PAIR,
        function*() {
            yield effects.put(
                RandomGifActions.requestNewGif(),
                "./Gifs/*"
            );
        }
    );
}

export default mainSaga;
```

At last, modify `src/RandomGifPair/index.js` to register the saga accordingly (via [ManageableComponentOptions / saga](../../../api/ManageableComponentOptions.md#option-saga)).

#### 4.2.2 `LOADING_START` & `LOADING_COMPLETE` actions

To support, we need to find a way to capture the `LOADING_START` & `LOADING_COMPLETE` actions emitted from `RandomGif` component. From section 3.6.1.2, you can tell `LOADING_START` & `LOADING_COMPLETE` will be thrown just out of `RandomGif` Container (i.e. the first namespace part above `RandomGif` in the `Namespace Tree`). Thus, both actions will be dispatched to namespace path: `${this.componentManager.fullPath}/Gifs`. Because multicast actions are always flow-down along the `Namespace Tree`, our `RandomGifPair` won't receive them.

To capture those actions, we can use a helper component: `ActionForwarder`. We can import it frpm `fractal-component`:
```javascript
import { AppContainerUtils, AppContainer, ActionForwarder } from "fractal-component";
```
And add the followings to `render()` method (as `ActionForwarder` doesn't render anything, you can put it anywhere in React Component Tree):
```jsx
{/**
    * Use ActionForwarder to forward LOADING_START & LOADING_COMPLETE actions from `RandomGif`
    * to current component (`RandomGifPair`)'s namespace.
    * i.e. from `${this.componentManager.fullPath}/Gifs` to `${this.componentManager.fullPath}`
    * Thus, `relativeDispatchPath` should be ".."
    */}
<ActionForwarder
    namespacePrefix={`${this.componentManager.fullPath}/Gifs`}
    pattern={action =>
        action.type === RandomGifActionTypes.LOADING_START ||
        action.type === RandomGifActionTypes.LOADING_COMPLETE
    }
    relativeDispatchPath=".."
/>
``` 
Now, our `RandomGifPair` component can receive both `LOADING_START` & `LOADING_COMPLETE` actions from `RandomGif` component (either in a `reducer` or `saga`). Before we move on to `reducer` or `saga`. We need to define the component initial state as followings:

```javascript
this.state = {
    // --- record each `RandomGif` loading progress
    itemsLoading: {},
    // --- if `RandomGifPair` starts to load
    isLoading: false,
    // --- if any error received from any of the `RandomGif` component
    error: null
};
```

Next, we can create the `reducer` in `src/RandomGifPair/reducers/index.js`:

```javascript
import { actionTypes as RandomGifActionTypes } from "../../RandomGif";

const reducer = function(state, action) {
    switch (action.type) {
        case RandomGifActionTypes.LOADING_START:
            return {
                ...state,
                isLoading: true,
                itemsLoading: {
                    ...state.itemsLoading,
                    [action.componentId]: true
                }
            };
        case RandomGifActionTypes.LOADING_COMPLETE: {
            const { isSuccess, payloadError } = action.payload;
            let { itemsLoading, error } = state;
            itemsLoading = {
                ...itemsLoading,
                [action.componentId]: false
            };
            let isLoading = false;
            Object.keys(itemsLoading).forEach(componentId => {
                if (itemsLoading[componentId]) isLoading = true;
            });
            return {
                ...state,
                isLoading,
                error: error ? error : isSuccess ? null : payloadError,
                itemsLoading
            };
        }
        default:
            return state;
    }
};
export default reducer;
```

At last, we can added the following to `saga` to dispatch `RandomGifPair` out-going actions:
```javascript
function* mainSaga(effects) {
    let isLoadingStartActionDispatched = false;
    yield effects.takeEvery(
        RandomGifActionTypes.LOADING_START,
        function*() {
            // --- we use local variable `isLoadingStartActionDispatched`
            // --- to make sure only dispatch one `LOADING_START` action
            if (!isLoadingStartActionDispatched) {
                yield effects.put(
                    actions.loadingStart(),
                    "../../../*"
                );
            }
        }
    );

    yield effects.takeEvery(
        RandomGifActionTypes.LOADING_COMPLETE,
        function*() {
            /**
             * throw exposed action out of box
             * It's guaranteed all reducers are run before saga.
             * Therefore, if you get state in a saga via `select` effect,
             * it'll always be applied state.
             */
            const { isLoading, error } = yield effects.select();
            if (!isLoading) {
                yield effects.put(
                    actions.loadingComplete(error),
                    "../../../*"
                );
                isLoadingStartActionDispatched = false;
            }
        }
    );
}
```

#### 4.2.3 `NEW_GIF`

We will also want to forward `NEW_GIF` from `RandomGif` components. Therefore, component users will know how many new gifs has been loaded in total by couting no. of `NEW_GIF` actions. 

To do so, we need to add a new `ActionForwarder` to `render()` method:
```jsx
{/**
    * Use ActionForwarder to throw NEW_GIF out of RandomGifPair container
    * Set namespace to `${this.componentManager.fullPath}/Gifs` in order to listen to
    * all `out of box` actions from two `RandomGif` components
    */}
<ActionForwarder
    namespacePrefix={`${this.componentManager.fullPath}/Gifs`}
    pattern={RandomGifActionTypes.NEW_GIF}
    relativeDispatchPath="../../../../*"
/>
```

#### 4.2.4 Setup Out-Going / Incoming Actions 

Firstly, we update the component registration code to register action types & set allowed incoming actions:
```javascript
this.componentManager = new ComponentManager(this, {
    namespace: "io.github.t83714/RandomGif",
    reducer,
    saga,
    // --- register all action types so that actions are serialisable
    actionTypes,
    allowedIncomingMulticastActionTypes: [actionTypes.REQUEST_NEW_PAIR],
    namespaceInitCallback: componentManager => { ... },
    namespaceDestroyCallback: ({ styleSheet }) => { ... }
});
```

We also need to export the following actions from `RandomGifPair` entry point `src/RandomGifPair/index.js`:
```javascript
//--- actions component may send out
const exposedActionTypes = {
    // --- export NEW_GIF action type as well just
    // --- so people can use `RandomGifPair` without knowing `RandomGif`
    NEW_GIF: RandomGifActionTypes.NEW_GIF,
    LOADING_START: actionTypes.LOADING_START,
    LOADING_COMPLETE: actionTypes.LOADING_COMPLETE,
    REQUEST_NEW_PAIR: actionTypes.REQUEST_NEW_PAIR
};
//--- action component will accept
const exposedActions = {
    requestNewPair: actions.requestNewPair
};

/**
 * expose actions for component users
 */
export { exposedActionTypes as actionTypes, exposedActions as actions };
```