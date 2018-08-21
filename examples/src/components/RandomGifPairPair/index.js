import * as React from "react";
//-- import fractal-component lib from src entry point
import { AppContainerUtils, ActionForwarder } from "../../../../src/index";

import RandomGifPair, {
    actionTypes as RandomGifPairActionTypes
} from "../RandomGifPair";

import namespace from "./namespace";
import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import reducer from "./reducers";
import saga from "./sagas";
import camelCase from "lodash/camelCase";
import findKey from "lodash/findKey";

import jss from "jss";
import styles from "./styles";

let styleSheet;

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
            reducer: reducer,
            saga: saga,
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
            allowedIncomingMulticastActionTypes: [actionTypes.REQUEST_NEW_PAIR_PAIR],
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
                            {this.state.isLoading
                                ? "Loading..."
                                : "Get Gif Pair Pair"}
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
                    relativeDispatchPath="../../../../*"
                />

                {/**
                 * Use ActionForwarder to forward LOADING_START & LOADING_COMPLETE actions from `RandomGifPair`
                 * to current component (`RandomGifPairPair`)'s namespace.
                 * i.e. from `${this.componentManager.fullPath}/GifPairs` to `${this.componentManager.fullPath}`
                 * Thus, `relativeDispatchPath` should be "../*"
                 */}
                <ActionForwarder
                    namespacePrefix={`${
                        this.componentManager.fullPath
                    }/GifPairs`}
                    pattern={action =>
                        action.type ===
                            RandomGifPairActionTypes.LOADING_START ||
                        action.type ===
                            RandomGifPairActionTypes.LOADING_COMPLETE
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

// --- export NEW_GIF action type as well just
// --- so people can use `RandomGifPairPair` without knowing `RandomGifPair`
exposedActionTypes["NEW_GIF"] = RandomGifPairActionTypes.NEW_GIF;

/**
 * expose actions for component users
 */
export {
    exposedActionTypes as actionTypes,
    exposedActions as actions,
    namespace
};
