import * as actionTypes from "./actionTypes";

export const initState = function(path, data, persistState) {
    return {
        type: actionTypes.INIT_STATE,
        payload: {
            path,
            data,
            persistState
        }
    };
};

export const emptyState = function(path) {
    return {
        type: actionTypes.EMPTY_STATE,
        payload: path
    };
};

