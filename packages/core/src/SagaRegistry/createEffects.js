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
            effectCreators[idx] = is.func(rsEffects[idx])
                ? rsEffects[idx].bind(thisObj)
                : rsEffects[idx];
        }
    });
    return effectCreators;
};

export default createEffects;
