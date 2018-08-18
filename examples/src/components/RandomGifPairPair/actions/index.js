import * as actionTypes from "./types";
import { AppContainerUtils} from "../../../../../src/index";
import namespace from "../namespace";

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

export function requestNewPair() {
    return {
        type: actionTypes.REQUEST_NEW_PAIR_PAIR,
        namespace
    };
}

export function newGif() {
    throw new Error(
        `As \`RandomGifPairPair\` component user, you are not supposed to create new action of \`${
            actionTypes.NEW_GIF
        }\`. This action is receive only.`
    );
}

export function loadingStart() {
    return {
        type: actionTypes.LOADING_START,
        namespace
    };
}

export function loadingComplete(error = null) {
    return {
        type: actionTypes.LOADING_COMPLETE,
        namespace,
        payload: {
            isSuccess: error ? false : true,
            error
        }
    };
}
