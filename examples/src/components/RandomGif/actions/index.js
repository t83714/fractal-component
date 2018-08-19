import * as actionTypes from "./types";
import namespace from "../namespace";

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
