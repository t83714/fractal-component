import * as actionTypes from "./types";

export function setData(data) {
    return {
        type: actionTypes.SET_DATA,
        payload: data
    };
}
