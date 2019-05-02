import * as actionTypes from "../actions/types";

const reducer = function(state, action) {
    switch (action.type) {
        case actionTypes.INCREASE_COUNT: {
            return { ...state, b: { ...state.b, b1: state.b.b1 + 1 } };
        }
        case actionTypes.FORCE_RENDER:
            return {
                ...state
            };
        default:
            return state;
    }
};
export default reducer;

export const initState = () => {
    return {
        b: {
            b1: 1
        }
    };
};
