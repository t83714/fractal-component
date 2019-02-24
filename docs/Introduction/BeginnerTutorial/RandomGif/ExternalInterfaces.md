### 3.6 Encapsulation & External Interfaces

Now, the required UI & functionalities of our `RandomGif` component have all been completed. However, we still need to do the followings to make sure the component is easy to be reused:

#### 3.6.1 Define External Action Interfaces

##### 3.6.1.1 Incoming Actions / `allowedIncomingMulticastActionTypes`

By default, the `Component Container` won't accept any multicast actions (non-multicast & direct addressed actions will always be accepted though). To make sure the component users can send `REQUEST_NEW_GIF` actions to this component in order to programmingly trigger the image loading, we can set the incoming actions rulse using `allowedIncomingMulticastActionTypes` option when register our component:

```javascript
this.componentManager = new ComponentManager(this, {
    namespace: "io.github.t83714/RandomGif",
    actionTypes,
    reducer,
    saga,
    // --- Only allow `actionTypes.REQUEST_NEW_GIF` to be received by component
    allowedIncomingMulticastActionTypes: [actionTypes.REQUEST_NEW_GIF],
    namespaceInitCallback: componentManager => {
        const styleSheet = jss
            .setup(jssDefaultPreset())
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
```

If you want your component to accept any actions, you can set `allowedIncomingMulticastActionTypes` to `"*"`.

> You should avoid setting `allowedIncomingMulticastActionTypes` to `"*"` unless you tried to create a `forwarder` type component. One example is the [ToggleButton](https://github.com/t83714/fractal-component/tree/master/examples/ToggleButton)

##### 3.6.1.2 `Outgoing External Actions`

It would be useful if our component sends out actions at different stages of requesting data from remote API so that other part of the program can monitor the actions and can act accordingly. We are going to define the following `Outgoing External Actions` (in `src/RandomGif/actions/types.js`):

```javascript
// --- dispatch when a NEW Random Gif URl is received from API
export const NEW_GIF = Symbol("NEW_GIF");
// --- dispatch when a request is just sent
export const LOADING_START = Symbol("LOADING_START");
// --- dispatch when a request is complete 
export const LOADING_COMPLETE = Symbol("LOADING_COMPLETE");
```

And, we need to define the following action creator functions accordingly (in `src/RandomGif/actions/index.js`):

```javascript
export function newGif() {
    return {
        type: actionTypes.NEW_GIF
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

Next, we can modify `saga` to dispatch those actions at appropriate places:

```javascript
const mainSaga = function*(effects) {
    try{
        while(true){
            /**
             * Dedicated LOADING_START action to notify interested components outside
             * This component will not use it in any way
             */
            yield effects.put(actions.loadingStart(), "../../../*");

            // --- create an effect of taking an `REQUEST_NEW_GIF` action from this Component's action channel
            // --- Until an action is available for being taken, this saga will not resume its execution.
            const action = yield effects.take(actionTypes.REQUEST_NEW_GIF);
            const response = yield effects.call(fetchGif, "Y4P38sTJAgEBOHP1B3sVs0Jtk01tb6fA");
            const imgUrl = response.data.fixed_width_small_url;
            yield effects.put(actions.receiveNewGif(imgUrl));

            /**
             * The optional second `relativeDispatchPath` parameter defines
             * the relative (from current component full namespace path) namespace dispatch path.
             * i.e. suppose the current component full namespace path is:
             *  namespacePrefix        namespace                  random component ID
             *    `xxxxxx`   /  `io.github.t83714/RandomGif`  /        `cx`
             * e.g. `exampleApp/Gifs/io.github.t83714/RandomGif/c0`
             * If `relativeDispatchPath` is `../../../*`, the effective dispatch path is `exampleApp/Gifs/*`.
             * Although, theoretically, you could use `relativeDispatchPath` & ".." to dispatch the action
             * into any namespace, you should throw the action just out of the your component 
             * as you are supposed to know nothing about outside world as a component author.
             */
            //--- optional second `relativeDispatchPath` parameter
            //--- specify the action dispatch path
            yield effects.put(actions.newGif(), "../../../*");

            /**
             * Dedicated LOADING_COMPLETE action to notify interested components outside
             */
            yield effects.put(actions.loadingComplete(), "../../../*");
        }
    }catch(e){
        yield effects.put(actions.requestNewGifError(e));
        /**
         * Dedicated LOADING_COMPLETE action to notify interested components outside
         * This component will not use it in any way
         */
        yield effects.put(actions.loadingComplete(e), "../../../*");
    }
};
```

##### 3.6.1.3 Export External Actions Types

We will also want to export those external actions types (`in src/RandomGif/index.js`) for potential component users:

```javascript
//--- actions component may send out
const exposedActionTypes = {
    NEW_GIF: actionTypes.NEW_GIF,
    LOADING_START: actionTypes.LOADING_START,
    LOADING_COMPLETE: actionTypes.LOADING_COMPLETE,
    REQUEST_NEW_GIF: actionTypes.REQUEST_NEW_GIF
};
//--- action component will accept
const exposedActions = {
    requestNewGif: actions.requestNewGif
};

/**
 * expose actions for component users
 */
export { exposedActionTypes as actionTypes, exposedActions as actions };
```

##### 3.6.1.4 Class.contextType

> This section is only required for React Class Component. React Function Component use [Hook APIs](https://reactjs.org/docs/hooks-reference.html#usecontext) to retrieve context and doesn't require setting `Class.contextType`.

The `contextType` property of the React Class Component needs to be assigned a Context object `AppContainerContext` in order to make the React Class Component to receive `AppContainer` instance from context.

Here is an example:

```javascript
import React from "react";
import { ComponentManager, AppContainerContext } from "fractal-component";

class RandomGif extends React.Component {
    constructor(props) {
        super(props);
        this.componentManager = new ComponentManager(this, {
            namespace: "io.github.t83714/RandomGif"
        });
    }

    render() {
        return <div>Hello from RandomGif!</div>;
    }
}

// --- Set contentType allow `AppContainer` pass through React Context
RandomGif.contextType = AppContainerContext;

export default RandomGif;
```

#### 3.6.2 Component Config Properties

We will want to define the following React Component Properties to allow users to config our component's functionalities:

```javascript
RandomGif.propTypes = {
    // --- User can set `showButton` to false to hide the button
    showButton: PropTypes.bool,
    // --- Allow component user to set their own Giphy.com API key
    apiKey: PropTypes.string,
    // --- Allow user replace component built stylesheet
    styles: PropTypes.object,
    /*
    * Allow user specify the `AppContainer` for this component through component property
    */
    appContainer: PropTypes.instanceOf(AppContainer)
};

// --- set component properties default value
RandomGif.defaultProps = {
    showButton: true,
    apiKey: "Y4P38sTJAgEBOHP1B3sVs0Jtk01tb6fA"
};
```

> Component users generally will not want to provide `AppContainer` instance explicitly through Component Props `appContainer`. Passing it through React Context will always be easier. Moreover, if you don't create an `AppContainer` instance, Component Manager will auto-create one during the initialisation and share among all components.

> Besides the component properties defined above, users can always set `namespacePrefix` property to set the `namespace prefix` of the component.

##### 3.6.2.1 `showButton`

To hide `Get Gif` button depends on `showButton` property, we can update `Get Gif` button JSX in `render()` to the followings:
```javascript
{this.props.showButton && (
    <div className={`${classes.cell} `}>
        <button
            onClick={() => {
                this.componentManager.dispatch(
                    actions.requestNewGif()
                );
            }}
            disabled={this.state.isLoading}
        >
            {this.state.isLoading
                ? "Requesting API..."
                : "Get Gif"}
        </button>
    </div>
)}
```

##### 3.6.2.2 `apiKey`

To allow users to update `apiKey`, we need to update `saga` to the followings:

```javascript
const mainSaga = function*(effects, apiKey) {
    ...
    const response = yield effects.call(fetchGif, apiKey);
    ...
};
```

And then, we need to `prefill` the last parameter of the `saga` when register the component:

```javascript
import partialRight from "lodash/partialRight";
...
this.componentManager = new ComponentManager(this, {
    ...
    saga: partialRight(saga, props.apiKey),
    ...
});
```

##### 3.6.2.3 `styles`

In order to allow users to override the component built-in stylesheet, we need to update the `namespaceInitCallback` & `namespaceDestroyCallback` to the followings:

```javascript
this.componentManager = new ComponentManager(this, {
    ...
    namespaceInitCallback: componentManager => {
        let jssRef;
        if(!props.styles){
            // --- if use built-in style, we want to make sure 
            // --- that this component use its own jss setting
            jssRef = jss.setup(jssDefaultPreset());
        }else{
            jssRef = jss
        }
        const styleSheet = jssRef
            .createStyleSheet(props.styles ? props.styles : styles, {
                // --- use componentManager's createClassNameGenerator
                generateClassName: componentManager.createClassNameGenerator()
            })
            .attach();
        return { styleSheet };
    },
    namespaceDestroyCallback: ({ styleSheet }) => {
        styleSheet.detach();
    }
});
```