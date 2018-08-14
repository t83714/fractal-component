import * as actionTypes from "./types";

export function requestNewPair() {
    return {
        type: actionTypes.REQUEST_NEW_PAIR_PAIR
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
        type: actionTypes.LOADING_START
    };
}

export function loadingComplete(error = null) {
    return {
        type: actionTypes.LOADING_COMPLETE,
        payload: {
            isSuccess: error ? false : true,
            error
        }
    };
}
