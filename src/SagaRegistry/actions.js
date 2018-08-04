import * as actionTypes from "./actionTypes";

export const initSaga = function(sagaItem) {
    return {
        type: actionTypes.INIT_SAGA,
        payload: sagaItem
    };
};

export const cancelSaga = function(pathOrTask) {
    return {
        type: actionTypes.CANCEL_SAGA,
        payload: pathOrTask
    };
};
