import * as actionTypes from "./actionTypes";

export const initState = function(path, data, isOverwrite) {
    return {
        type: actionTypes.INIT_STATE,
        payload: {
            path,
            data,
            isOverwrite
        }
    };
};

export const emptyState = function(path, isOverwrite) {
    return {
        type: actionTypes.EMPTY_STATE,
        payload: {
            path,
            isOverwrite
        }
    };
};

