import { is as reduxSagaIs } from "redux-saga/utils";
import pkg from "../package.json";

let devMode = false;
if (
    process &&
    process.env &&
    process.env.NODE_ENV &&
    process.env.NODE_ENV === "development"
) {
    devMode = true;
}

export const getPackageName = function() {
    return pkg.name;
};

export const getPackageVersion = function() {
    return pkg.version;
};

export const isDevMode = function() {
    return devMode;
};

export const log = function(message, level = "log", error = "") {
    /*eslint-disable no-console*/
    if (typeof window === "undefined") {
        console.log(
            `fractal-component ${level}: ${message}\n${(error && error.stack) ||
                error}`
        );
    } else {
        console[level](message, error);
    }
};

export const trim = function(v) {
    if (!v) return "";
    if (is.string(v)) return v.trim();
    const s = String(v);
    return s.trim();
};

export const konst = v => () => v;
export const kTrue = konst(true);
export const kFalse = konst(false);
export const noop = () => {};
export const identity = v => v;

export const is = {
    ...reduxSagaIs,
    bool: v => typeof v === "boolean"
};
