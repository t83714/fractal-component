import { RUN_SAGA } from "./actionTypes";

export const runSaga = function(saga, ...args) {
  return {
    action: RUN_SAGA,
    payload: { saga, args }
  };
};
