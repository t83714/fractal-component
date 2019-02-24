import React from "react";
import PropTypes from "prop-types";
import {
    ComponentManager,
    AppContainerContext,
    AppContainer
} from "fractal-component";
import * as actionTypes from "./actions/types";
import * as actions from "./actions/index";
import jss from "jss";
import jssDefaultPreset from "jss-preset-default";
import styles from "./styles";

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
        this.styleSheet = null;
        this.componentManager = new ComponentManager(this, {
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

Counter.propTypes = {
    styles: PropTypes.object,
    appContainer: PropTypes.instanceOf(AppContainer)
};
// --- Define contentType allow `AppContainer` pass through React Context
Counter.contextType = AppContainerContext;

export default Counter;

export { actionTypes, actions };
