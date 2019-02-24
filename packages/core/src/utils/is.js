/**
 * The code of file is modified from [redux-saga](https://github.com/redux-saga/redux-saga) project
 * @redux-saga/is module
 */
import { NAMESPACED, COMPONENT_MANAGER_ACCESS_KEY } from "../symbols";
import AppContainer from "../AppContainer";
import ComponentManager from "../ComponentManager";

export const undef = v => v === null || v === undefined;
export const notUndef = v => v !== null && v !== undefined;
export const func = f => typeof f === "function";
export const number = n => typeof n === "number";
export const string = s => typeof s === "string";
export const array = Array.isArray;
export const object = obj => obj && !array(obj) && typeof obj === "object";
export const promise = p => p && func(p.then);
export const iterator = it => it && func(it.next) && func(it.throw);
export const iterable = it =>
    it && func(Symbol) ? func(it[Symbol.iterator]) : array(it);
export const observable = ob => ob && func(ob.subscribe);
export const buffer = buf =>
    buf && func(buf.isEmpty) && func(buf.take) && func(buf.put);
export const pattern = pat =>
    pat && (string(pat) || symbol(pat) || func(pat) || array(pat));
export const channel = ch => ch && func(ch.take) && func(ch.close);
export const stringableFunc = f => func(f) && f.hasOwnProperty("toString");
export const symbol = sym =>
    Boolean(sym) &&
    typeof Symbol === "function" &&
    sym.constructor === Symbol &&
    sym !== Symbol.prototype;
export const bool = typeof v === "boolean";
export const action = v => object(v) && symbol(v.type);
export const namespacedAction = v => action(v) && v[NAMESPACED];
export const appContainer = v => v && v instanceof AppContainer;
export const managedComponentInstance = c =>
    c && c[COMPONENT_MANAGER_ACCESS_KEY] instanceof ComponentManager;
