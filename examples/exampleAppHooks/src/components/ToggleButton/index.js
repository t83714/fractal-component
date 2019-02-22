import React from "react";
import PropTypes from "prop-types";
import {
    useComponentManager,
    ActionForwarder,
    utils,
    AppContainer
} from "fractal-component";
import * as actionTypes from "./actions/types";
import * as actions from "./actions/index";
import jss from "jss";
import jssDefaultPreset from "jss-preset-default";
import styles from "./styles";

const { is } = utils;

function ToggleButton(props) {
    const [
        state,
        dispatch,
        getNamespaceData,
        componentManager
    ] = useComponentManager(props, {
        initState: {
            isActive: false
        },
        namespace: "io.github.t83714/ToggleButton",
        reducer: function(state, action) {
            switch (action.type) {
                case actionTypes.CLICK:
                    return { ...state, isActive: !state.isActive };
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
        allowedIncomingMulticastActionTypes: "*",
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
            <div className={classes.cell}>ToggleButton</div>
            <div className={`${classes.cell} ${classes["button-container"]}`}>
                <button
                    className={
                        state.isActive ? classes["active"] : classes["inactive"]
                    }
                    onClick={() => {
                        dispatch(actions.click());
                    }}
                >
                    {state.isActive ? "ACTIVE" : "INACTIVE"}
                </button>
            </div>
            {/*
                    Set namespacePrefix to same as this component `namespacePrefix`
                    so this ActionForwarder will get all incoming actions
                    We use `props.namespacePrefix` & `props.pattern` 
                    so that `ToggleButton` can be used as generic `action transformer` later
                    We don't need to worry if the namespace field of transformed action will match its original namespace
                    ActionForwarder will do the query and adjust accordingly
                */}
            <ActionForwarder
                namespacePrefix={props.namespacePrefix}
                pattern={props.pattern}
                relativeDispatchPath={props.relativeDispatchPath}
                transformer={action => {
                    let newAction;
                    if (is.func(props.transformer)) {
                        newAction = props.transformer(action);
                    } else if (is.symbol(props.transformer)) {
                        newAction = {
                            ...action,
                            type: props.transformer
                        };
                    } else {
                        throw new Error("Invalid transformer type.");
                    }
                    return {
                        ...newAction,
                        toggleButtonActive: state.isActive
                    };
                }}
                appContainer={componentManager.appContainer}
            />
        </div>
    );
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
    transformer: PropTypes.oneOfType([PropTypes.symbol, PropTypes.func]),
    styles: PropTypes.object,
    appContainer: PropTypes.instanceOf(AppContainer)
};

export default ToggleButton;

export { actionTypes, actions };
