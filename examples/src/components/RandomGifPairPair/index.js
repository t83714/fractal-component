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

import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import camelCase from "lodash/camelCase";

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

class RandomGifPairPair extends React.Component {
    constructor(props) {
        super(props);
        /**
         * init state of the component
         * it's auto managed by `fractal-component` (i.e. auto sync with redux store)
         * You will get an error if you call this.setState
         * You should instead change this.state via actions & reducer below
         */
        this.state = {
            isLoading: {},
            error: {}
        };
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714",
            reducer: function(state, action) {
                switch (action.type) {
                    case RandomGifPairActionTypes.LOADING_START:
                        return {
                            ...state,
                            isLoading: {
                                ...state.isLoading,
                                [action.componentId]: true
                            }
                        };
                    case RandomGifPairActionTypes.LOADING_COMPLETE:
                        const { isSuccess, error } = action.payload;
                        return {
                            ...state,
                            isLoading: {
                                ...state.isLoading,
                                [action.componentId]: false
                            },
                            error: {
                                ...state.error,
                                [action.componentId]: isSuccess ? null : error
                            }
                        };
                    default:
                        return state;
                }
            },
            saga: function*(effects) {
                yield effects.takeEvery(
                    RandomGifPairActionTypes.LOADING_START,
                    function*() {
                        /**
                         * throw expose action out of box
                         * It's guaranteed all reducers are run before saga.
                         * Therefore, if you get state in a saga via `select` effect,
                         * you will get applied state.
                         */
                        const state = yield effects.select();
                        let isLoading = false;
                        Object.keys(state.isLoading).forEach(componentId => {
                            if (state.isLoading[componentId] === true) {
                                isLoading = true;
                            }
                        });
                        if (isLoading) {
                            effects.put(actions.loadingStart(), "../../*");
                        }
                    }
                );
                yield effects.takeEvery(
                    RandomGifPairActionTypes.LOADING_COMPLETE,
                    function*() {
                        /**
                         * throw expose action out of box
                         * It's guaranteed all reducers are run before saga.
                         * Therefore, if you get state in a saga via `select` effect,
                         * you will get applied state.
                         */
                        const state = yield effects.select();
                        let isComplete = true;
                        let error = null;
                        Object.keys(state.isLoading).forEach(componentId => {
                            if (state.isLoading[componentId] === true) {
                                // --- if any of the RandomGif still loading, we haven't completed the loading yet
                                isComplete = false;
                            }
                            if (state.error[componentId]) {
                                error = state.error[componentId];
                            }
                        });
                        if (isComplete) {
                            effects.put(
                                actions.loadingComplete(error),
                                "../../*"
                            );
                        }
                    }
                );
                // --- monitor `REQUEST_NEW_PAIR_PAIR` and send multicast actions to RandomGifPairs
                yield effects.takeEvery(
                    actionTypes.REQUEST_NEW_PAIR_PAIR,
                    function*() {
                        yield effects.put(
                            RandomGifPairActions.requestNewPair(),
                            "./Gifs/*"
                        );
                    }
                );
            }
        });
    }

    render() {
        const isLoading = Object.keys(this.state.isLoading).reduce(
            (aggV, curId) => {
                if (this.state.isLoading[curId] === true) {
                    return true;
                }
                return aggV;
            },
            false
        );

        return (
            <div className={classes.table}>
                <div className={classes.cell}>RandomGif Pair</div>
                <div className={`${classes.cell}`}>
                    <div>
                        <RandomGif
                            showButton={false}
                            namespacePrefix={`${
                                this.componentManager.fullPath
                            }/GifPairs`}
                        />
                    </div>
                    <div>
                        <RandomGif
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
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Get Gif Pair Pair"}
                        </button>
                    </div>
                )}
                <ActionForwarder
                    namespacePrefix={`${
                        this.componentManager.fullPath
                    }/GifPairs`}
                    pattern={RandomGifPairActionTypes.NEW_GIF}
                    relativeDispatchPath="../../../*"
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
    const camelcaseAct = camelCase(act);
    exposedActionTypes[act] = act;
    exposedActions[camelcaseAct] = actions[camelcaseAct];
});

/**
 * expose actions for component users
 */
export { exposedActionTypes as actionTypes, exposedActions as actions };
