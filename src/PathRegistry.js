import { is, trim } from "./utils";

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
        if (is.string(action)) {
            action = { type: action };
        }
        if (!is.object(action)) {
            throw new Error(
                `Tried to dispatch action in invalid type: ${typeof action}`
            );
        }
        const { type: actionType } = action;
        if (actionType.indexOf("/") !== -1)
            throw new Error("Namespaced action type cannot contains `/`.");
        let path = normalize(relativeDispatchPath);
        let isMulticast = false;
        if (path.length && path[path.length - 1] === "*") {
            isMulticast = true;
            path = normalize(path.substring(0, path.length - 1));
        }
        const absolutePath = this.resolve(path);
        const pathParts = [];
        if (absolutePath !== "") pathParts.push(absolutePath);
        if (isMulticast && absolutePath !== "") pathParts.push("*");
        pathParts.push(pathParts.length ? `@${action.type}` : action.type);
        const type = pathParts.join("/");
        const newAction = {
            ...action,
            type,
            isMulticast,
            pureType: actionType,
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
    constructor() {
        this.paths = [];
        this.localPathPosStore = {};
    }

    add(path, localPathPos = null) {
        validate(path);
        path = normalize(path);
        if (this.paths.indexOf(path) !== -1) return null;
        this.paths.push(path);
        if (is.number(localPathPos)) {
            this.localPathPosStore[path] = localPathPos;
        }
        return path;
    }

    remove(path) {
        validate(path);
        path = normalize(path);
        this.paths = this.paths.filter(item => item !== path);
        delete this.localPathPosStore[path];
    }

    exist(path) {
        if (this.paths.indexOf(path) !== -1) return true;
        else return false;
    }

    /**
     *
     * @param {Action} action dispatch Action
     * 
     */
    searchDispatchPaths(action) {
        let dispatchPath, isMulticast;

        if (!action.currentDispatchPath) {
            const lastSepIdx = action.type.lastIndexOf("/@");
            if (lastSepIdx === -1) return [];
            let path = normalize(action.type.substring(0, lastSepIdx));
            isMulticast = path[path.length - 1] === "*";
            path = path.substring(0, path.length - 1);
            if (path[path.length - 1] === "/") {
                path = path.substring(0, path.length - 1);
            }
            dispatchPath = path;
        } else {
            dispatchPath = action.currentDispatchPath;
            isMulticast = action.isMulticast;
        }

        if (!isMulticast) {
            if (this.exist(dispatchPath)) return [dispatchPath];
            else return [];
        }

        const r = this.paths.filter(item => {
            // --- exact match will always be included
            if (item === dispatchPath) return true;
            // --- only include sub branch paths. e.g. `dispatchPath` is part of and shorter than `item`
            if (item.indexOf(dispatchPath + "/") !== 0) return false;
            
            /**
             * the dispatch path must on or beyond local namespace boundary before an action is dispatched to this component.
             * e.g. For a component:
             * Namespace Prefix     Namespace               ComponentID
             * exampleApp/Gifs   /  io.github.t83714    /    RandomGif-sdjiere
             * The local namespace boundary is between `exampleApp/Gifs` and `io.github.t83714/RandomGif-sdjiere`
             * Actions dispatched on `exampleApp/Gifs` (on boundary) or 
             * `exampleApp/Gifs/io.github.t83714` (beyond the boundary) will be accepted by this component.
             * Actions dispatched on `exampleApp` will not be accepted by this component.
             */
            const localPathPos = this.localPathPosStore[item];
            if (!is.number(localPathPos)) return true;
            if (dispatchPath.length - 1 >= localPathPos - 2) return true;
            return false;
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
