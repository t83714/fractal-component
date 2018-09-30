import * as rsEffects from "redux-saga/effects";
import { SagaItem } from "../SagaRegistry";

declare function createEffects(
    thisObj: any,
    sageItem: SagaItem
): typeof rsEffects;

export default createEffects;