import { is, trim } from "./utils";
import { NAMESPACED } from "./symbols";

export class PathContext {
    constructor(cwd) {
        this.cwd = normalize(cwd);
        if (this.cwd.indexOf("*") !== -1)
            throw new Error("`cwd` cannot contains `*`");
        if (this.cwd.indexOf(".") !== -1) {
            this.cwd = this.compressPath(this.cwd);
        }
    }

    getLastSegment() {
        const idx = this.cwd.lastIndexOf("/");
        if (idx >= this.cwd.length - 1) return "";
        return this.cwd.substring(idx + 1);
    }

    compressPath(paths, ignoreExcessDoubleDot = true) {
        if (is.string(paths)) paths = [paths];
        const calculatedParts = [];
        paths
            .map(p => p.trim())
            .forEach(p => {
                if (p.indexOf("*") !== -1)
                    throw new Error(
                        "Failed to resolve path: path segments cannot contain `*`"
                    );
                p.split("/").forEach(item => {
                    item = trim(item);
                    switch (item) {
                        case "":
                            break;
                        case ".":
                            break;
                        case "..":
                            if (calculatedParts.length) {
                                calculatedParts.pop();
                            } else {
                                if (!ignoreExcessDoubleDot) {
                                    calculatedParts.push("..");
                                }
                            }
                            break;
                        default:
                            calculatedParts.push(item);
                    }
                });
            });
        return calculatedParts.join("/");
    }

    resolve(...paths) {
        const pathItems = [this.cwd, ...paths];
        return this.compressPath(pathItems);
    }

    convertNamespacedAction(action, relativeDispatchPath) {
        if (!is.object(action)) {
            throw new Error(
                `Tried to dispatch action in invalid type: ${typeof action}`
            );
        }
        if (!is.symbol(action.type)) {
            throw new Error(
                `action.type cannot be ${typeof action.type} and must be a Symbol`
            );
        }

        let path = normalize(relativeDispatchPath);
        let isMulticast = false;
        if (path.length && path[path.length - 1] === "*") {
            isMulticast = true;
            path = normalize(path.substring(0, path.length - 1));
        }
        const absolutePath = this.resolve(path);
        const newAction = {
            ...action,
            [NAMESPACED]: true,
            isMulticast,
            currentSenderPath: this.cwd,
            currentDispatchPath: absolutePath,
            currentComponentId: this.getLastSegment()
        };
        if (!newAction.senderPath)
            newAction.senderPath = newAction.currentSenderPath;
        if (!newAction.dispatchPath)
            newAction.dispatchPath = newAction.currentDispatchPath;
        if (!newAction.componentId)
            newAction.componentId = newAction.currentComponentId;
        return newAction;
    }
}

export default class PathRegistry {
    constructor(shouldKeepOrder = false) {
        this.paths = [];
        this.dataStore = {};
        this.shouldKeepOrder = shouldKeepOrder;
    }

    destroy() {
        this.paths = [];
        this.dataStore = {};
    }

    add(path, data = undefined) {
        validate(path);
        path = normalize(path);
        if (this.paths.indexOf(path) !== -1) return null;
        this.paths.push(path);
        if (this.shouldKeepOrder) {
            this.paths.sort((a, b) => {
                if (a.length < b.length) return -1;
                else if (a.length > b.length) return 1;
                else 0;
            });
        }
        if (is.notUndef(data)) this.dataStore[path] = data;
        return path;
    }

    getPathData(path) {
        const data = this.dataStore[path];
        return data ? data : {};
    }

    setPathData(path, data) {
        this.dataStore[path] = data;
    }

    mergePathData(path, data) {
        if (is.object(this.dataStore[path])) {
            this.dataStore[path] = Object.assign(
                {},
                this.dataStore[path],
                data
            );
        } else {
            this.dataStore[path] = data;
        }
    }

    removePathData(path) {
        delete this.dataStore[path];
    }

    foreach(iteratee) {
        Object.keys(this.dataStore).forEach(key =>
            iteratee(this.dataStore[key], key)
        );
    }

    map(iteratee) {
        return Object.keys(this.dataStore).map(key =>
            iteratee(this.dataStore[key], key)
        );
    }

    searchPathByPathData(predictFunc) {
        if (!is.func(predictFunc))
            throw new Error(
                "searchPathByPathData require function as parameter!"
            );
        return Object.keys(this.dataStore).find(key =>
            predictFunc(this.dataStore[key])
        );
    }

    remove(path) {
        validate(path);
        path = normalize(path);
        this.paths = this.paths.filter(item => item !== path);
        delete this.dataStore[path];
    }

    exist(path) {
        if (this.paths.indexOf(path) !== -1) return true;
        else return false;
    }

    isAllowedMulticast(path, actionType) {
        const { allowedIncomingMulticastActionTypes } = this.getPathData(path);
        if (!allowedIncomingMulticastActionTypes) return false;
        if (
            is.string(allowedIncomingMulticastActionTypes) &&
            allowedIncomingMulticastActionTypes === "*"
        )
            return true;
        if (is.symbol(allowedIncomingMulticastActionTypes)) {
            return allowedIncomingMulticastActionTypes === actionType;
        }
        if (!is.array(allowedIncomingMulticastActionTypes)) {
            throw new Error(
                "PathRegistry.isAllowedMulticast: invalid `allowedIncomingMulticastActionTypes` option type. "
            );
        }
        return allowedIncomingMulticastActionTypes.indexOf(actionType) !== -1;
    }

    /**
     *
     * @param {Action} action dispatch Action
     *
     */
    searchDispatchPaths(action) {
        if (!this.shouldKeepOrder) {
            throw new Error(
                "`searchDispatchPaths` method requires PathRegistry to be initialised in `keepOrder` mode."
            );
        }

        if (action[NAMESPACED] !== true) {
            throw new Error(
                "PathRegistry: cannot searchDispatchPaths for a non-namespaced action."
            );
        }

        const { currentDispatchPath: dispatchPath, isMulticast } = action;

        if (!isMulticast) {
            if (this.exist(dispatchPath)) return [dispatchPath];
            else return [];
        }

        const rejectedPaths = [];

        return this.paths.filter(item => {
            // --- only include sub branch paths. e.g. `dispatchPath` is part of and shorter than `item`
            // --- exact same path should also be included e.g. item === dispatchPath
            if (
                dispatchPath !== "" && // --- empty dispatchPath indicates a multicast action dispatched at root level
                item.indexOf(dispatchPath + "/") !== 0 &&
                item !== dispatchPath
            ) {
                return false;
            }

            if (
                rejectedPaths.findIndex(
                    path => item.indexOf(path + "/") !== -1
                ) !== -1
            ) {
                // --- if parent container reject this action
                // --- child containers won't see it
                // --- this logic requires that all paths are added in order
                // --- i.e. from string length lower to higher
                return false;
            }

            const { allowedIncomingMulticastActionTypes } = this.getPathData(
                item
            );
            if (allowedIncomingMulticastActionTypes === "*") {
                /**
                 * If a component is set to accept `any` action types (i.e. `allowedIncomingMulticastActionTypes` set to "*"), the dispatch path
                 * must on or beyond local namespace boundary before a multicast action is dispatched to this component.
                 * e.g. For a component:
                 * Namespace Prefix                Namespace                   ComponentID
                 * exampleApp/Gifs   /  io.github.t83714/ActionForwarder    /  sdjiere
                 * The local namespace boundary is between `exampleApp/Gifs` and `io.github.t83714/ActionForwarder/sdjiere`
                 * Actions dispatched on `exampleApp/Gifs` (on boundary) or
                 * `exampleApp/Gifs/io.github.t83714` (beyond the boundary) will be accepted by this component.
                 * Actions dispatched on `exampleApp` will not be accepted by this component.
                 */
                const { localPathPos } = this.dataStore[item]
                    ? this.dataStore[item]
                    : {};
                if (!is.number(localPathPos)) return true;
                if (dispatchPath.length - 1 >= localPathPos - 2) return true;
                rejectedPaths.push(item);
                return false;
            } else {
                // --- only components / registered path accepts Multicast action will be included.
                const isAllowed = this.isAllowedMulticast(item, action.type);
                if (!isAllowed) {
                    rejectedPaths.push(item);
                }
                return isAllowed;
            }
        });
    }
}

export function validate(path) {
    if (path.indexOf("*") !== -1) {
        throw new Error("path cannot contain `*`");
    }
}

export function normalize(path, toLowerCase = false) {
    path = trim(path);
    if (toLowerCase) path = path.toLowerCase();
    if (path[0] === "/") {
        if (path.length === 1) {
            path = "";
        } else {
            path = path.substring(1);
        }
    }
    if (path[path.length - 1] === "/") {
        if (path.length === 1) {
            path = "";
        } else {
            path = path.substring(0, path.length - 1);
        }
    }
    return path;
}
