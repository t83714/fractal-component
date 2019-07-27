import React from "react";
import PropTypes from "prop-types";
import {
    useComponentManager,
    AppContainer,
    ActionForwarder
} from "fractal-component";

import RandomGifPair, {
    actionTypes as RandomGifPairActionTypes
} from "../RandomGifPair";

import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import reducer from "./reducers";
import saga from "./sagas";

import jss from "jss";
import jssDefaultPreset from "jss-preset-default";
import styles from "./styles";

function RandomGifPairPair(props) {
    const [
        state,
        dispatch,
        getNamespaceData,
        componentManager
    ] = useComponentManager(props, {
        initState: {
            itemsLoading: {},
            isLoading: false,
            error: null
        },
        namespace: "io.github.t83714/RandomGifPairPair",
        reducer: reducer,
        saga: saga,
        /**
         * Register actions for action serialisation / deserialisation.
         * It's much easier to use Symbol as action type to make sure no action type collision among different component.
         * ( Considering we now use actions as primary way for inter-component communication, it's quite important in a multicaset action environment)
         */
        actionTypes,
        // --- specify accepted types of external multicast actions
        // --- By default, component will not accept any incoming multicast action.
        // --- No limit to actions that are sent out
        allowedIncomingMulticastActionTypes: [
            actionTypes.REQUEST_NEW_PAIR_PAIR
        ],
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
            <div className={classes.cell}>RandomGif Pair Pair</div>
            <div className={`${classes.cell}`}>
                <div>
                    <RandomGifPair
                        showButton={false}
                        apiKey={props.apiKey}
                        namespacePrefix={`${componentManager.fullPath}/GifPairs`}
                        appContainer={componentManager.appContainer}
                    />
                </div>
                <div>
                    <RandomGifPair
                        showButton={false}
                        apiKey={props.apiKey}
                        namespacePrefix={`${componentManager.fullPath}/GifPairs`}
                        appContainer={componentManager.appContainer}
                    />
                </div>
            </div>
            {props.showButton && (
                <div className={`${classes.cell} `}>
                    <button
                        onClick={() => {
                            dispatch(actions.requestNewPairPair());
                        }}
                        disabled={state.isLoading}
                    >
                        {state.isLoading ? "Loading..." : "Get Gif Pair Pair"}
                    </button>
                </div>
            )}
            {/**
             * Use ActionForwarder to throw NEW_GIF out of RandomGifPairPair container
             * Set namespace to `${componentManager.fullPath}/GifPairs` in order to listen to
             * all `out of box` actions from two `RandomGifPair` components
             * Here, we don't need (shouldn't) to use a `transformer` to make any changes to actions because:
             * - As a component author, we are not supposed to know if any component is interested more in `INCREASE_COUNT` actions
             * - There is an `ActionForwarder` outside this box already and will do all transformation job
             */}
            <ActionForwarder
                namespacePrefix={`${componentManager.fullPath}/GifPairs`}
                pattern={RandomGifPairActionTypes.NEW_GIF}
                relativeDispatchPath="../../../../*"
                appContainer={componentManager.appContainer}
            />

            {/**
             * Use ActionForwarder to forward LOADING_START & LOADING_COMPLETE actions from `RandomGifPair`
             * to current component (`RandomGifPairPair`)'s namespace.
             * i.e. from `${componentManager.fullPath}/GifPairs` to `${componentManager.fullPath}`
             * Thus, `relativeDispatchPath` should be "../*"
             */}
            <ActionForwarder
                namespacePrefix={`${componentManager.fullPath}/GifPairs`}
                pattern={action =>
                    action.type === RandomGifPairActionTypes.LOADING_START ||
                    action.type === RandomGifPairActionTypes.LOADING_COMPLETE
                }
                relativeDispatchPath=".."
                appContainer={componentManager.appContainer}
            />
        </div>
    );
}

RandomGifPairPair.propTypes = {
    showButton: PropTypes.bool,
    apiKey: PropTypes.string,
    styles: PropTypes.object,
    appContainer: PropTypes.instanceOf(AppContainer)
};

RandomGifPairPair.defaultProps = {
    showButton: true
};

export default RandomGifPairPair;

//--- actions component may send out
const exposedActionTypes = {
    // --- export NEW_GIF action type as well just
    // --- so people can use `RandomGifPairPair` without knowing `RandomGifPair`
    NEW_GIF: RandomGifPairActionTypes.NEW_GIF,
    LOADING_START: actionTypes.LOADING_START,
    LOADING_COMPLETE: actionTypes.LOADING_COMPLETE,
    REQUEST_NEW_PAIR_PAIR: actionTypes.REQUEST_NEW_PAIR_PAIR
};
//--- action component will accept
const exposedActions = {
    requestNewPairPair: actions.requestNewPairPair
};

/**
 * expose actions for component users
 */
export { exposedActionTypes as actionTypes, exposedActions as actions };
