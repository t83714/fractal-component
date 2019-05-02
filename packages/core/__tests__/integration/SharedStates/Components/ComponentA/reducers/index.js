import * as actionTypes from "../actions/types";

const reducer = function(state, action) {
    switch (action.type) {
        case actionTypes.INCREASE_COUNT: {
            return {
                ...state,
                a: { ...state.a, a1: state.a.a1.map(v => v + 1) }
            };
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
        a: {
            a1: [1]
        }
    };
};
