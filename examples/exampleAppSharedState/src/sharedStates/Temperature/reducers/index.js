import * as actionTypes from "../actions/types";

const reducer = function(state, action) {
    switch (action.type) {
        case actionTypes.UPDATE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export default reducer;

export const initState = function() {
    return {
        temperature: "",
        scale: "c"
    };
};
