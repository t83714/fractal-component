import * as actionTypes from "./actionTypes";
import namespace from "./namespace";

export const initd = function() {
    return {
        type: actionTypes.INITD,
        namespace
    };
};

export const destroy = function() {
    return {
        type: actionTypes.DESTROY,
        namespace
    };
};
