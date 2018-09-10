import * as is from "./utils/is";
import pkg from "../package.json";


let devMode = false;
if (
    typeof process === "object" &&
    is.notUndef(process.env) &&
    is.notUndef(process.env.NODE_ENV) &&
    process.env.NODE_ENV === "development"
) {
    devMode = true;
}

let IS_NODE = null;

export const isInNode = function() {
    if (IS_NODE === null) {
        IS_NODE =
            typeof process === "object" &&
            Object.prototype.toString.call(process) === "[object process]";
    }
    return IS_NODE;
};

/**
 * Modified from https://github.com/adamhalasz/uniqid
 */
let machineInfo = null;

export const getMachineInfo = function() {
    if (machineInfo !== null) return machineInfo;
    if (!isInNode()) {
        machineInfo = {
            pid: null,
            macAddr: "",
            macAddrInt: null
        };
        return machineInfo;
    }
    let macAddr = "",
        macAddrInt = null,
        pid = null;

    try {
        const networkInterfaces = require("os").networkInterfaces();
        let interface_key;
        for (interface_key in networkInterfaces) {
            const networkInterface = networkInterfaces[interface_key];
            const length = networkInterface.length;
            for (let i = 0; i < length; i++) {
                if (
                    networkInterface[i].mac &&
                    networkInterface[i].mac != "00:00:00:00:00:00"
                ) {
                    macAddr = networkInterface[i].mac;
                    break;
                }
            }
            if (macAddr !== "") break;
        }
        pid = process && process.pid ? process.pid : null;
        macAddrInt = macAddr ? parseInt(macAddr.replace(/\:|\D+/gi, "")) : null;
        if (isNaN(macAddrInt)) macAddrInt = null;
    } catch (e) {}

    machineInfo = {
        pid,
        macAddr,
        macAddrInt
    };

    return machineInfo;
};

let lastTimeStamp = null;
export const uniqid = function(prefix) {
    let { pid, macAddrInt: mac } = getMachineInfo();
    if (is.number(pid) && pid) {
        pid = pid.toString(36);
    } else {
        pid = "";
    }
    if (is.number(mac) && mac) {
        mac = mac.toString(36);
    } else {
        mac = "";
    }
    const now = Date.now();
    const last = lastTimeStamp || now;
    lastTimeStamp = now > last ? now : last + 1;
    return (prefix || "") + mac + pid + lastTimeStamp.toString(36);
};

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

export { is };

export const createClassNameGenerator = function(namespace) {
    let ruleCounter = 0;
    const runtimeNamespace = namespace ? namespace : this ? this.namespace : "";
    if (!runtimeNamespace) {
        throw new Error("createClassNameGenerator: namespace cannot be empty!");
    }
    const prefix = runtimeNamespace.replace(/[^a-zA-Z0-9-]/g, "-");
    return () => {
        ruleCounter += 1;
        return `${prefix}-${ruleCounter}`;
    };
};

// --- avoid toString to be converted to ""+ by minifier
export const symbolToString = s => Symbol.prototype.toString.apply(s);