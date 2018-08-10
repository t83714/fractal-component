import * as actionTypes from "../actions/types";

const reducer = function(state, action) {
    switch (action.type) {
        case actionTypes.REQUEST_NEW_GIF:
            return {
                ...state,
                isLoading: true
            };
        case actionTypes.RECEIVE_NEW_GIF:
            const imageUrl = action.payload;
            return {
                ...state,
                isLoading: false,
                imageUrl
            };
        default: return state;
    }
};
export default reducer;
