import { is, trim, getPackageName } from "./utils";

export const NAMESPACED = Symbol(`@@${getPackageName()}/NAMESPACED`);

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
        paths.map(p => p.trim()).forEach(p => {
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
            senderPath: this.cwd,
            dispatchPath: absolutePath,
            componentId: this.getLastSegment()
        };
        if (!newAction.originalSenderPath)
            newAction.originalSenderPath = newAction.senderPath;
        if (!newAction.originalDispatchPath)
            newAction.originalDispatchPath = newAction.dispatchPath;
        if (!newAction.originalComponentId)
            newAction.originalComponentId = newAction.componentId;
        return newAction;
    }
}

export default class PathRegistry {
    constructor() {
        this.paths = [];
        this.dataStore = {};
    }

    add(path, data = undefined) {
        validate(path);
        path = normalize(path);
        if (this.paths.indexOf(path) !== -1) return null;
        this.paths.push(path);
        this.dataStore[path] = data;
        return path;
    }

    getPathData(path) {
        const data = this.dataStore[path];
        return data ? data : {};
    }

    setPathData(path, data) {
        this.dataStore[path] = data;
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
        const { acceptMulticastActionTypes } = this.getPathData(path);
        if (!acceptMulticastActionTypes) return false;
        if (
            is.string(acceptMulticastActionTypes) &&
            acceptMulticastActionTypes === "*"
        )
            return true;
        if (is.symbol(acceptMulticastActionTypes)) {
            return acceptMulticastActionTypes === actionType;
        }
        if (!is.array(acceptMulticastActionTypes)) {
            throw new Error(
                "PathRegistry.isAllowedMulticast: invalid `acceptMulticastActionTypes` option type. "
            );
        }
        return acceptMulticastActionTypes.indexOf(actionType) !== -1;
    }

    /**
     *
     * @param {Action} action dispatch Action
     *
     */
    searchDispatchPaths(action) {
        if (action[NAMESPACED] !== true) {
            throw new Error(
                "PathRegistry: cannot searchDispatchPaths for a non-namespaced action."
            );
        }

        const { dispatchPath, isMulticast } = action;

        if (!isMulticast) {
            if (this.exist(dispatchPath)) return [dispatchPath];
            else return [];
        }

        const r = this.paths.filter(item => {
            // --- only include sub branch paths. e.g. `dispatchPath` is part of and shorter than `item`
            // --- exact same path should also be included e.g. item === dispatchPath
            if (item.indexOf(dispatchPath + "/") !== 0 && item !== dispatchPath)
                return false;

            const { acceptMulticastActionTypes } = this.getPathData(item);
            if (acceptMulticastActionTypes === "*") {
                /**
                 * If a component is set to accept `any` action types (i.e. `acceptMulticastActionTypes` set to "*"), the dispatch path
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
                return false;
            } else {
                // --- only components / registered path accepts Multicast action will be included.
                return this.isAllowedMulticast(item, action.type);
            }
        });
        return r;
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
