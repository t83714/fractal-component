import * as React from "react";
//-- import fractal-component lib from src entry point
import { AppContainerUtils } from "../../../../src/index";
import namespace from "./namespace";
import * as actionTypes from "./actions/types";
import * as actions from "./actions/index";

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
        /**
         * Register actions is optional for action serialisation / deserialisation.
         * It's much easier to use Symbol as action type to make sure no action type collision among different component.
         * ( Considering we now use actions as primary way for inter-component communication, it's quite important in a multicaset action environment)
         * However, Symbol is not serialisable by its nature and serialisable actions is the key to `time travel` feature.
         * Here we provide an ActionRegistry facility to achieve the serialisation (By re-establish the mapping). To do that, you need:
         * - Register your action types via `AppContainerUtils.registerActions(namespace, actionTypes)`
         * - All actions created must carry the namespace fields. Here the namespace is your component namespace.
         */
        AppContainerUtils.registerActions(namespace, actionTypes);

        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace,
            reducer: function(state, action) {
                switch (action.type) {
                    case actionTypes.INCREASE_COUNT:
                        return { ...state, count: state.count + 1 };
                    default:
                        return state;
                }
            },
            // --- specify accepted types of external multicast actions
            // --- By default, component will not accept any incoming multicast action.
            // --- No limit to actions that are sent out
            acceptMulticastActionTypes: [actionTypes.INCREASE_COUNT]
        });
    }

    render() {
        return <p>Counter: {this.state.count}</p>;
    }
}

export default Counter;

export { actionTypes, actions, namespace };
