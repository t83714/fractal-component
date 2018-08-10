import * as actionTypes from "./types";

export function requestNewGif() {
    return {
        type: actionTypes.REQUEST_NEW_GIF
    };
}

export function receiveNewGif(imgUrl) {
    return {
        type: actionTypes.RECEIVE_NEW_GIF,
        payload: imgUrl
    };
}

export function newGif() {
    return {
        type: actionTypes.NEW_GIF
    };
}