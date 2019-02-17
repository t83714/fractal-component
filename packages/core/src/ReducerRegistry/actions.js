import * as actionTypes from "./actionTypes";
import namespace from "./namespace";

export const initState = function(path, data, persistState) {
    return {
        type: actionTypes.INIT_STATE,
        namespace,
        payload: {
            path,
            data,
            persistState
        }
    };
};

export const emptyState = function(path, data) {
    return {
        type: actionTypes.EMPTY_STATE,
        namespace,
        payload: {
            path,
            data
        }
    };
};
