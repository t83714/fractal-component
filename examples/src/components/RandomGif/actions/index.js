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

export function requestNewGif() {
    return {
        namespace,
        type: actionTypes.REQUEST_NEW_GIF
    };
}

export function receiveNewGif(imgUrl) {
    return {
        namespace,
        type: actionTypes.RECEIVE_NEW_GIF,
        payload: imgUrl
    };
}

export function newGif() {
    return {
        namespace,
        type: actionTypes.NEW_GIF
    };
}

export function requestNewGifError(error) {
    return {
        namespace,
        type: actionTypes.REQUEST_NEW_GIF_ERROR,
        payload: error
    };
}

export function loadingStart() {
    return {
        namespace,
        type: actionTypes.LOADING_START
    };
}

export function loadingComplete(error = null) {
    return {
        namespace,
        type: actionTypes.LOADING_COMPLETE,
        payload: {
            isSuccess: error ? false : true,
            error
        }
    };
}
