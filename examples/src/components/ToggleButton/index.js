import * as React from "react";
//-- import fractal-component lib from src entry point
import { AppContainerUtils } from "../../../../src/index";
import namespace from "./namespace";
import * as actionTypes from "./actions/types";
import * as actions from "./actions/index";
import jss from "jss";
import styles from "./styles";

let styleSheet;

class ToggleButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isActive: false
        };
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace,
            reducer: function(state, action) {
                switch (action.type) {
                    case actionTypes.CLICK:
                        return { ...state, isActive: !state.isActive };
                    default:
                        return state;
                }
            },
            /**
             * Register actions is optional for action serialisation / deserialisation.
             * It's much easier to use Symbol as action type to make sure no action type collision among different component.
             * ( Considering we now use actions as primary way for inter-component communication, it's quite important in a multicaset action environment)
             * However, Symbol is not serialisable by its nature and serialisable actions is the key to `time travel` feature.
             * Here we provide an ActionRegistry facility to achieve the serialisation (By re-establish the mapping). To do that, you need:
             * - Register your action types via `AppContainerUtils.registerActions(namespace, actionTypes)`
             * - All actions created must carry the namespace fields. Here the namespace is your component namespace.
             */
            actionTypes,
            // --- specify accepted types of external multicast actions
            // --- By default, component will not accept any incoming multicast action.
            // --- No limit to actions that are sent out
            allowedIncomingMulticastActionTypes: "*",
            namespaceInitCallback: () => {
                styleSheet = jss.createStyleSheet(styles).attach();
                return { styleSheet };
            },
            namespaceDestroyCallback: ({ styleSheet }) => {
                styleSheet.detach();
            }
        });
    }

    render() {
        const { classes } = styleSheet;
        return (
            <div className={classes.table}>
                <div className={classes.cell}>ToggleButton</div>
                <div
                    className={`${classes.cell} ${
                        classes["counter-container"]
                    }`}
                >
                    <button></button>
                </div>
            </div>
        );
    }
}

export default ToggleButton;

export { actionTypes, actions, namespace };
