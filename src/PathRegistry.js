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
     * If an action dispatch reached or beyond a container local namespace boundary,
     * we consider it as an outbound dispatch. Otherwise, it's an inbound dispatch.
     * For a given action, if action.currentSenderPath is sub path of action.dispatch path,
     * we will consider the action is in a `Outbound` dispatch.
     * Outbound dispatch should not dispatch to any paths unless the dispatch path is
     * beyond the local namespace boundary defined by localPathPos.
     * A local namespace is made up of a container component's `namespace` + `componenent ID`.
     * It doesn't include `namespace prefix`.
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

        let isOutbound;
        if (!action.currentSenderPath) isOutbound = false;
        else {
            isOutbound =
                action.currentSenderPath.indexOf(action.currentDispatchPath) ===
                0;
        }

        const r = this.paths.filter(item => {
            // --- exact match will always be included
            if (item === dispatchPath) return true;
            // --- only include sub branch paths. e.g. `dispatchPath` is part of and shorter than `item`
            if (item.indexOf(dispatchPath + "/") !== 0) return false;
            /**
             * make sure no `reverse direction` dispatch.
             * i.e. If an action dispatch reached or beyond a container local namespace boundary,
             * the action should not be sent back to this container.
             * i.e. if action.senderPath is sub branch of action.fromPath (i.e. an out going dispatch),
             * any
             */
            const localPathPos = this.localPathPosStore[item];
            if (!is.number(localPathPos)) return true;
            if (dispatchPath.length - 1 >= localPathPos - 2) return true;
            return false;
            /*
            if (isOutbound) {
                // --- dispatchPath is beyond local namespace boundary
                if (dispatchPath.length - 1 <= localPathPos -1 ) return true;
                else return false;
            } else {
                if (dispatchPath.length - 1 >= localPathPos - 1) return true;
                else return false;
            }*/
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
