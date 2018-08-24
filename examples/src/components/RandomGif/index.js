import * as React from "react";
import PropTypes from "prop-types";
//-- import fractal-component lib from src entry point
import { AppContainerUtils } from "../../../../src/index";

import reducer from "./reducers";
import saga from "./sagas";
import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import camelCase from "lodash/camelCase";
import findKey from "lodash/findKey";
import partialRight from "lodash/partialRight";

import jss from "jss";
import styles from "./styles";

let styleSheet;

class RandomGif extends React.Component {
    constructor(props) {
        super(props);
        /**
         * You can set initState via AppContainerUtils.registerComponent options as well.
         * this.state gets higher priority
         */
        this.state = {
            isLoading: false,
            imageUrl: null,
            error: null
        };
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714/RandomGif",
            reducer: reducer,
            saga: partialRight(saga, props.apiKey),
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
            // --- only accept one type of external multicast action
            // --- By default, component will not accept any incoming multicast action.
            // --- No limit to actions that are sent out
            allowedIncomingMulticastActionTypes: [actionTypes.REQUEST_NEW_GIF],
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
                <div className={classes.cell}>RandomGif</div>
                <div
                    className={`${classes.cell} ${classes["image-container"]}`}
                >
                    {this.state.imageUrl &&
                        !this.state.isLoading &&
                        !this.state.error && (
                            <img
                                alt="Gif"
                                src={this.state.imageUrl}
                                className={`${classes.image}`}
                            />
                        )}
                    {(!this.state.imageUrl || this.state.isLoading) &&
                        !this.state.error && (
                            <p>
                                {this.state.isLoading
                                    ? "Requesting API..."
                                    : "No GIF loaded yet!"}
                            </p>
                        )}
                    {this.state.error && (
                        <p>{`Failed to request API: ${this.state.error}`}</p>
                    )}
                </div>
                {this.props.showButton && (
                    <div className={`${classes.cell} `}>
                        <button
                            onClick={() => {
                                this.componentManager.dispatch(
                                    actions.requestNewGif()
                                );
                            }}
                            disabled={this.state.isLoading}
                        >
                            {this.state.isLoading
                                ? "Requesting API..."
                                : "Get Gif"}
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

RandomGif.propTypes = {
    showButton: PropTypes.bool,
    apiKey: PropTypes.string
};

RandomGif.defaultProps = {
    showButton: true,
    apiKey: "Y4P38sTJAgEBOHP1B3sVs0Jtk01tb6fA"
};

export default RandomGif;

const exposedActionList = [
    actionTypes.NEW_GIF,
    actionTypes.LOADING_START,
    actionTypes.LOADING_COMPLETE,
    actionTypes.REQUEST_NEW_GIF
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
export {
    exposedActionTypes as actionTypes,
    exposedActions as actions
};
