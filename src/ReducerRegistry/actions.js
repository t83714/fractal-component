import { ADD_REDUCER } from "./actionTypes";

export const addReducer = function(reducerItem) {
  return {
    action: ADD_REDUCER,
    payload: reducerItem
  };
};
