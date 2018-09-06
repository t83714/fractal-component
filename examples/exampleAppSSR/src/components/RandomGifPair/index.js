import React from "react";
import PropTypes from "prop-types";
import { AppContainerUtils, ActionForwarder, AppContainer } from "fractal-component";

import RandomGif, { actionTypes as RandomGifActionTypes } from "../RandomGif";

import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import reducer from "./reducers";
import saga from "./sagas";
import camelCase from "lodash/camelCase";
import findKey from "lodash/findKey";

import jss from "jss";
import styles from "./styles";

class RandomGifPair extends React.Component {
    constructor(props) {
        super(props);
        /**
         * init state of the component
         * it's auto managed by `fractal-component` (i.e. auto sync with redux store)
         * You will get an error if you call this.setState
         * You should instead change this.state via actions & reducer below
         */
        this.state = {
            itemsLoading: {},
            isLoading: false,
            error: null
        };
        this.isLoadingStartActionDispatched = false;

        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714/RandomGifPair",
            reducer,
            saga,
            /**
             * Register actions for action serialisation / deserialisation.
             * It's much easier to use Symbol as action type to make sure no action type collision among different component.
             * ( Considering we now use actions as primary way for inter-component communication, it's quite important in a multicaset action environment)
             */
            actionTypes,
            // --- specify accepted types of external multicast actions
            // --- By default, component will not accept any incoming multicast action.
            // --- No limit to actions that are sent out
            allowedIncomingMulticastActionTypes: [actionTypes.REQUEST_NEW_PAIR],
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
                <div className={classes.cell}>RandomGif Pair</div>
                <div className={`${classes.cell}`}>
                    <div>
                        <RandomGif
                            showButton={false}
                            apiKey={this.props.apiKey}
                            namespacePrefix={`${
                                this.componentManager.fullPath
                            }/Gifs`}
                            appContainer={this.props.appContainer}
                        />
                    </div>
                    <div>
                        <RandomGif
                            showButton={false}
                            apiKey={this.props.apiKey}
                            namespacePrefix={`${
                                this.componentManager.fullPath
                            }/Gifs`}
                            appContainer={this.props.appContainer}
                        />
                    </div>
                </div>
                {this.props.showButton && (
                    <div className={`${classes.cell} `}>
                        <button
                            onClick={() => {
                                this.componentManager.dispatch(
                                    actions.requestNewPair()
                                );
                            }}
                            disabled={this.state.isLoading}
                        >
                            {this.state.isLoading
                                ? "Loading..."
                                : "Get Gif Pair"}
                        </button>
                    </div>
                )}
                {/**
                 * Use ActionForwarder to throw NEW_GIF out of RandomGifPair container
                 * Set namespace to `${this.componentManager.fullPath}/Gifs` in order to listen to
                 * all `out of box` actions from two `RandomGif` components
                 * Here, we don't need (shouldn't) to use a `transformer` to make any changes to actions because:
                 * - As a component author, we are not supposed to know if any component is interested more in `INCREASE_COUNT` actions
                 * - There is an `ActionForwarder` outside this box already and will do all transformation job
                 */}
                <ActionForwarder
                    namespacePrefix={`${this.componentManager.fullPath}/Gifs`}
                    pattern={RandomGifActionTypes.NEW_GIF}
                    relativeDispatchPath="../../../../*"
                    appContainer={this.props.appContainer}
                />

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
                    appContainer={this.props.appContainer}
                />
            </div>
        );
    }
}

RandomGifPair.propTypes = {
    showButton: PropTypes.bool,
    apiKey: PropTypes.string,
    appContainer: PropTypes.instanceOf(AppContainer)
};

RandomGifPair.defaultProps = {
    showButton: true
};

export default RandomGifPair;

const exposedActionList = [
    actionTypes.LOADING_START,
    actionTypes.LOADING_COMPLETE,
    actionTypes.REQUEST_NEW_PAIR
];

const exposedActionTypes = {};
const exposedActions = {};

exposedActionList.forEach(act => {
    const actKey = findKey(actionTypes, item => item === act);
    const camelcaseAct = camelCase(actKey);
    exposedActionTypes[actKey] = act;
    exposedActions[camelcaseAct] = actions[camelcaseAct];
});

// --- export NEW_GIF action type as well just
// --- so people can use `RandomGifPair` without knowing `RandomGif`
exposedActionTypes["NEW_GIF"] = RandomGifActionTypes.NEW_GIF;

/**
 * expose actions for component users
 */
export {
    exposedActionTypes as actionTypes,
    exposedActions as actions
};
