import * as React from "react";
import PropTypes from "prop-types";
//-- import fractal-component lib from src entry point
import { AppContainerUtils, ActionForwarder, is } from "../../../../src/index";
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
             * Register action types is optional for action serialisation / deserialisation.
             * It's much easier to use Symbol as action type to make sure no action type collision among different component.
             * ( Considering we now use actions as primary way for inter-component communication, it's quite important in a multicaset action environment)
             * However, Symbol is not serialisable by its nature and serialisable actions is the key to `time travel` feature.
             * Here we provide an ActionRegistry facility to achieve the serialisation (By re-establish the mapping). To do that, you need:
             * - Register your action types via `AppContainerUtils.registerActions(namespace, actionTypes)`
             */
            actionTypes,
            // --- specify accepted types of external multicast actions
            // --- By default, component will not accept any incoming multicast action.
            // --- No limit to actions that are sent out
            // --- Commented out the following line as Toggle button doesn't need to process any actions (ActionForwarder below will do the job).
            // --- allowedIncomingMulticastActionTypes: "*",
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
                    className={`${classes.cell} ${classes["button-container"]}`}
                >
                    <button
                        className={
                            this.state.isActive
                                ? classes["active"]
                                : classes["inactive"]
                        }
                        onClick={() => {
                            this.componentManager.dispatch(actions.click());
                        }}
                    >
                        {this.state.isActive ? "ACTIVE" : "INACTIVE"}
                    </button>
                </div>
                {/*
                    Set namespacePrefix to same as this component `namespacePrefix`
                    so this ActionForwarder will get all incoming actions
                    We use `this.props.namespacePrefix` & `this.props.pattern` 
                    so that `ToggleButton` can be used as generic `action transformer` later
                    We don't need to worry if the namespace field of transformed action will match its original namespace
                    ActionForwarder will do the query and adjust accordingly
                */}
                <ActionForwarder
                    namespacePrefix={this.props.namespacePrefix}
                    pattern={this.props.pattern}
                    relativeDispatchPath={this.props.relativeDispatchPath}
                    transformer={action => {
                        let newAction;
                        if(is.func(this.props.transformer)){
                            newAction = this.props.transformer(action);
                        } else if(is.symbol(this.props.transformer)){
                            newAction = {
                                ...action,
                                type: this.props.transformer
                            };
                        }else{
                            throw new Error("Invalid transformer type.");
                        }
                        return {
                            ...newAction,
                            toggleButtonActive: this.state.isActive
                        };
                    }}
                />
            </div>
        );
    }
}

ToggleButton.propTypes = {
    namespacePrefix: PropTypes.string.isRequired,
    pattern: PropTypes.oneOfType([
        PropTypes.symbol,
        PropTypes.func,
        PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        )
    ]),
    relativeDispatchPath: PropTypes.string,
    transformer: PropTypes.oneOfType([PropTypes.symbol, PropTypes.func])
};

export default ToggleButton;

export { actionTypes, actions, namespace };