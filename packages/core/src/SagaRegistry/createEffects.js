import * as namespacedEffects from "./namespacedEffects";
import * as rsEffects from "redux-saga/effects";
import { is } from "../utils";

const createEffects = (thisObj, SagaItem) => {
    const effectCreators = {};
    Object.keys(namespacedEffects).forEach(idx => {
        effectCreators[idx] = namespacedEffects[idx].bind(thisObj, SagaItem);
    });
    Object.keys(rsEffects).forEach(idx => {
        if (is.undef(effectCreators[idx])) {
            effectCreators[idx] = rsEffects[idx].bind(thisObj);
        }
    });
    return effectCreators;
};

export default createEffects;
