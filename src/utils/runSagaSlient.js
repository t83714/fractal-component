import { fork } from "redux-saga/effects";

const runSagaSlient = function*(saga, args) {
  try {
    if (args && args.length) {
      yield fork(saga, ...args);
    } else {
      yield fork(saga);
    }
  } catch (e) {
    console.error(e);
  }
};

export default runSagaSlient;
