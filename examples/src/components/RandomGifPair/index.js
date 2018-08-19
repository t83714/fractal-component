import * as React from "react";
import { create as jssCreate } from "jss";
import jssDefaultPreset from "jss-preset-default";
import color from "color";
//-- import fractal-component lib from src entry point
import { AppContainerUtils, ActionForwarder } from "../../../../src/index";

import RandomGif, { actionTypes as RandomGifActionTypes } from "../RandomGif";

import namespace from "./namespace";
import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import reducer from "./reducers";
import saga from "./sagas";
import camelCase from "lodash/camelCase";
import findKey from "lodash/findKey";

const styles = {
    table: {
        display: "flex",
        "flex-wrap": "wrap",
        margin: "0.2em 0.2em 0.2em 0.2em",
        padding: 0,
        "flex-direction": "column",
        width: "41em"
    },
    cell: {
        "box-sizing": "border-box",
        "flex-grow": 1,
        width: "100%",
        overflow: "hidden",
        padding: "0.2em 0.2em",
        border: `solid 2px ${color("slategrey").fade(0.5)}`,
        "border-bottom": "none",
        "background-color": "#f7f7f7",
        display: "flex",
        "flex-direction": "row",
        "align-items": "center",
        "justify-content": "space-evenly",
        "&:last-child": {
            "border-bottom": `solid 2px ${color("slategrey").fade(
                0.5
            )} !important`
        }
    },
    "image-container": {
        height: "15em"
    },
    image: {
        width: "100%",
        height: "100%"
    }
};

const jss = jssCreate(jssDefaultPreset());
const { classes } = jss.createStyleSheet(styles).attach();

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
            reducer,
            saga,
            // --- specify accepted types of external multicast actions
            // --- By default, component will not accept any incoming multicast action.
            // --- No limit to actions that are sent out
            acceptMulticastActionTypes: [actionTypes.REQUEST_NEW_PAIR]
        });
    }

    render() {
        return (
            <div className={classes.table}>
                <div className={classes.cell}>RandomGif Pair</div>
                <div className={`${classes.cell}`}>
                    <div>
                        <RandomGif
                            showButton={false}
                            namespacePrefix={`${
                                this.componentManager.fullPath
                            }/Gifs`}
                        />
                    </div>
                    <div>
                        <RandomGif
                            showButton={false}
                            namespacePrefix={`${
                                this.componentManager.fullPath
                            }/Gifs`}
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
                />
            </div>
        );
    }
}

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
    exposedActions as actions,
    namespace
};
