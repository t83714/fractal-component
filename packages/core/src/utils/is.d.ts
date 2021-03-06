import { Action } from "redux";
import { Buffer, Channel } from "redux-saga";
import { Pattern, ActionPattern } from "redux-saga/effects";
import AppContainer from "../AppContainer";
import ComponentManager from "../ComponentManager";
export type GuardPredicate<G extends T, T = any> = (arg: T) => arg is G;

export const undef: GuardPredicate<undefined>;
export const notUndef: GuardPredicate<any>;
// tslint:disable-next-line:ban-types
export const func: GuardPredicate<Function>;
export const number: GuardPredicate<number>;
export const string: GuardPredicate<string>;
export const array: GuardPredicate<any[]>;
export const object: GuardPredicate<object>;
export const promise: GuardPredicate<Promise<any>>;
export const iterator: GuardPredicate<Iterator<any>>;
export const iterable: GuardPredicate<Iterable<any>>;
// tslint:disable-next-line:ban-types
export const observable: GuardPredicate<{ subscribe: Function }>;
export const buffer: GuardPredicate<Buffer<any>>;
export const pattern: GuardPredicate<Pattern<any> | ActionPattern>;
export const channel: GuardPredicate<Channel<any>>;
// tslint:disable-next-line:ban-types
export const stringableFunc: GuardPredicate<Function>;
export const symbol: GuardPredicate<symbol>;
export const bool: GuardPredicate<boolean>;
export const action: GuardPredicate<Action<symbol>>;
export const namespacedAction: GuardPredicate<Action<symbol>>;
export const appContainer: GuardPredicate<AppContainer>;
export const managedComponentInstance: GuardPredicate<ComponentManager>;
