import * as namespacedEffects from "./namespacedEffects";
import * as rsEffects from "redux-saga/effects";

const createEffects = (thisObj, SagaItem) => {
    const effectCreators = {};
    Object.keys(rsEffects).forEach(idx => {
        effectCreators[idx] = rsEffects[idx].bind(thisObj);
    });
    Object.keys(namespacedEffects).forEach(idx => {
        effectCreators[idx] = namespacedEffects[idx].bind(thisObj, SagaItem);
    });
    return effectCreators;
};

export default createEffects;