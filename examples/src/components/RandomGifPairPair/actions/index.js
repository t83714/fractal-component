import * as actionTypes from "./types";
import namespace from "../namespace";

export function requestNewPair() {
    return {
        type: actionTypes.REQUEST_NEW_PAIR_PAIR,
        namespace
    };
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
