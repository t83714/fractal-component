import * as actionTypes from "./actionTypes";
import namespace from "./namespace";

export const initSaga = function(sagaItem) {
    return {
        type: actionTypes.INIT_SAGA,
        namespace,
        payload: sagaItem
    };
};

export const cancelSaga = function(pathOrTask) {
    return {
        type: actionTypes.CANCEL_SAGA,
        namespace,
        payload: pathOrTask
    };
};
