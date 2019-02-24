import React from "react";
import PropTypes from "prop-types";
import { useComponentManager, AppContainer } from "fractal-component";

import reducer from "./reducers";
import saga from "./sagas";
import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import partialRight from "lodash/partialRight";
import jss from "jss";
import jssDefaultPreset from "jss-preset-default";
import styles from "./styles";

function RandomGif(props) {
    const [state, dispatch, getNamespaceData] = useComponentManager(props, {
        initState: {
            isLoading: false,
            imageUrl: null,
            error: null
        },
        namespace: "io.github.t83714/RandomGif",
        reducer: reducer,
        saga: partialRight(saga, props.apiKey),
        /**
         * Register actions for action serialisation / deserialisation.
         * It's much easier to use Symbol as action type to make sure no action type collision among different component.
         * ( Considering we now use actions as primary way for inter-component communication, it's quite important in a multicaset action environment)
         */
        actionTypes,
        // --- only accept one type of external multicast action
        // --- By default, component will not accept any incoming multicast action.
        // --- No limit to actions that are sent out
        allowedIncomingMulticastActionTypes: [actionTypes.REQUEST_NEW_GIF],
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
            <div className={classes.cell}>RandomGif</div>
            <div className={`${classes.cell} ${classes["image-container"]}`}>
                {state.imageUrl && !state.isLoading && !state.error && (
                    <img
                        alt="Gif"
                        src={state.imageUrl}
                        className={`${classes.image}`}
                    />
                )}
                {(!state.imageUrl || state.isLoading) && !state.error && (
                    <p>
                        {state.isLoading
                            ? "Requesting API..."
                            : "No GIF loaded yet!"}
                    </p>
                )}
                {state.error && (
                    <p>{`Failed to request API: ${state.error}`}</p>
                )}
            </div>
            {props.showButton && (
                <div className={`${classes.cell} `}>
                    <button
                        onClick={() => {
                            dispatch(actions.requestNewGif());
                        }}
                        disabled={state.isLoading}
                    >
                        {state.isLoading ? "Requesting API..." : "Get Gif"}
                    </button>
                </div>
            )}
        </div>
    );
}

RandomGif.propTypes = {
    showButton: PropTypes.bool,
    apiKey: PropTypes.string,
    styles: PropTypes.object,
    appContainer: PropTypes.instanceOf(AppContainer)
};

RandomGif.defaultProps = {
    showButton: true,
    apiKey: "Y4P38sTJAgEBOHP1B3sVs0Jtk01tb6fA"
};

export default RandomGif;

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
