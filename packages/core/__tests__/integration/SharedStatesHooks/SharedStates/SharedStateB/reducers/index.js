import * as actionTypes from "../actions/types";

const reducer = function(state, action) {
    switch (action.type) {
        case actionTypes.INCREASE_COUNT: {
            return { ...state, count: state.count + 1 };
        }
        default:
            return state;
    }
};
export default reducer;

export const initState = () => {
    return {
        count: 0
    };
};
