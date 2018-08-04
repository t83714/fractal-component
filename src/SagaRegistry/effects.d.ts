import { SagaItem } from "../SagaRegistry";
import { Pattern, ForkEffect, PutEffect } from "redux-saga/effects";
import { Action } from "redux";

export declare function take(sagaItem: SagaItem, pattern: Pattern): TakeEffect;
export declare function put(sagaItem: SagaItem, action: Action): PutEffect<any>;
export declare function select(
    sagaItem: SagaItem,
    selector: (state: any, ...args: any[]) => any,
    ...args: any[]
): SelectEffect;
export declare function takeEvery(
    sagaItem: SagaItem,
    saga: GeneratorFunction,
    ...args: any[]
): ForkEffect;
export declare function takeLatest(
    sagaItem: SagaItem,
    saga: GeneratorFunction,
    ...args: any[]
): ForkEffect;
export declare function takeLeading(
    sagaItem: SagaItem,
    saga: GeneratorFunction,
    ...args: any[]
): ForkEffect;
export declare function throttle(
    ms: number,
    sagaItem: SagaItem,
    saga: GeneratorFunction,
    ...args: any[]
): ForkEffect;
