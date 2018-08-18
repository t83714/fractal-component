import * as React from "react";
import { create as jssCreate } from "jss";
import jssDefaultPreset from "jss-preset-default";
import color from "color";
//-- import fractal-component lib from src entry point
import { AppContainerUtils, ActionForwarder } from "../../../../src/index";

import RandomGifPair, {
    actions as RandomGifPairActions,
    actionTypes as RandomGifPairActionTypes
} from "../RandomGifPair";

import namespace from "./namespace";
import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import camelCase from "lodash/camelCase";
import findKey from "lodash/findKey";

const styles = {
    table: {
        display: "flex",
        "flex-wrap": "wrap",
        margin: "0.2em 0.2em 0.2em 0.2em",
        padding: 0,
        "flex-direction": "column",
        width: "82em"
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

class RandomGifPairPair extends React.Component {
    constructor(props) {
        super(props);
        /**
         * init state of the component
         * it's auto managed by `fractal-component` (i.e. auto sync with redux store)
         * You will get an error if you call `this.setState`
         * You should instead change this.state via actions & reducer below
         */
        this.state = {
            itemsLoading: {},
            isLoading: false,
            error: null
        };
        this.isLoadingStartActionDispatched = false;
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace,
            reducer: function(state, action) {
                switch (action.type) {
                    case RandomGifPairActionTypes.LOADING_START:
                        return {
                            ...state,
                            isLoading: true,
                            itemsLoading: {
                                ...state.itemsLoading,
                                [action.componentId]: true
                            }
                        };
                    case RandomGifPairActionTypes.LOADING_COMPLETE:
                        const { isSuccess, payloadError } = action.payload;
                        let { itemsLoading, error } = state;
                        itemsLoading = {
                            ...itemsLoading,
                            [action.componentId]: false
                        };
                        let isLoading = false;
                        Object.keys(itemsLoading).forEach(componentId => {
                            if (!itemsLoading[componentId]) isLoading = true;
                        });
                        return {
                            ...state,
                            isLoading,
                            error: error
                                ? error
                                : isSuccess
                                    ? null
                                    : payloadError,
                            itemsLoading
                        };
                    default:
                        return state;
                }
            },
            saga: function*(effects) {
                yield effects.takeEvery(
                    RandomGifPairActionTypes.LOADING_START,
                    function*() {
                        if (!this.isLoadingStartActionDispatched) {
                            yield effects.put(actions.loadingStart(), "../../*");
                        }
                    }.bind(this)
                );
                yield effects.takeEvery(
                    RandomGifPairActionTypes.LOADING_COMPLETE,
                    function*() {
                        /**
                         * throw exposed action out of box
                         * It's guaranteed all reducers are run before saga.
                         * Therefore, if you get state in a saga via `select` effect,
                         * it'll always be applied state.
                         */
                        const { isLoading } = yield effects.select();
                        if(!isLoading){
                            yield effects.put(
                                actions.loadingComplete(error),
                                "../../*"
                            );
                            this.isLoadingStartActionDispatched = false;
                        }
                    }.bind(this)
                );
                // --- monitor `REQUEST_NEW_PAIR_PAIR` and send multicast actions to RandomGifPairs
                yield effects.takeEvery(
                    actionTypes.REQUEST_NEW_PAIR_PAIR,
                    function*() {
                        yield effects.put(
                            RandomGifPairActions.requestNewPair(),
                            "./GifPairs/*"
                        );
                    }
                );
            }
        });
    }

    render() {

        return (
            <div className={classes.table}>
                <div className={classes.cell}>RandomGif Pair Pair</div>
                <div className={`${classes.cell}`}>
                    <div>
                        <RandomGifPair
                            showButton={false}
                            namespacePrefix={`${
                                this.componentManager.fullPath
                            }/GifPairs`}
                        />
                    </div>
                    <div>
                        <RandomGifPair
                            showButton={false}
                            namespacePrefix={`${
                                this.componentManager.fullPath
                            }/GifPairs`}
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
                            {this.state.isLoading ? "Loading..." : "Get Gif Pair Pair"}
                        </button>
                    </div>
                )}
                {/**
                 * Use ActionForwarder to throw NEW_GIF out of RandomGifPairPair container
                 * Set namespace to `${this.componentManager.fullPath}/GifPairs` in order to listen to
                 * all `out of box` actions from two `RandomGifPair` components
                 * Here, we don't need (shouldn't) to use a `transformer` to make any changes to actions because:
                 * - As a component author, we are not supposed to know if any component is interested more in `INCREASE_COUNT` actions
                 * - There is an `ActionForwarder` outside this box already and will do all transformation job
                 */}
                <ActionForwarder
                    namespacePrefix={`${
                        this.componentManager.fullPath
                    }/GifPairs`}
                    pattern={RandomGifPairActionTypes.NEW_GIF}
                    relativeDispatchPath="../../../*"
                />

                {/**
                 * Use ActionForwarder to forward LOADING_START & LOADING_COMPLETE actions from `RandomGifPair`
                 * to current component (`RandomGifPairPair`)'s namespace.
                 * i.e. from `${this.componentManager.fullPath}/GifPairs` to `${this.componentManager.fullPath}`
                 * Thus, `relativeDispatchPath` should be "../*"
                 */}
                <ActionForwarder
                    namespacePrefix={`${this.componentManager.fullPath}/GifPairs`}
                    pattern={action =>
                        action.type === RandomGifPairActionTypes.LOADING_START ||
                        action.type === RandomGifPairActionTypes.LOADING_COMPLETE
                    }
                    relativeDispatchPath=".."
                />
            </div>
        );
    }
}

RandomGifPairPair.defaultProps = {
    showButton: true
};

export default RandomGifPairPair;

const exposedActionList = [
    actionTypes.LOADING_START,
    actionTypes.LOADING_COMPLETE,
    actionTypes.REQUEST_NEW_PAIR_PAIR
];

const exposedActionTypes = {};
const exposedActions = {};

exposedActionList.forEach(act => {
    const actKey = findKey(actionTypes, item => item === act);
    const camelcaseAct = camelCase(actKey);
    exposedActionTypes[actKey] = act;
    exposedActions[camelcaseAct] = actions[camelcaseAct];
});

/**
 * expose actions for component users
 */
export { exposedActionTypes as actionTypes, exposedActions as actions, namespace };
