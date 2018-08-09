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
        return { ...action, type, originPath: absolutePath };
    }
}

export default class PathRegistry {
    constructor() {
        this.paths = [];
    }

    add(path) {
        validate(path);
        path = normalize(path);
        if (this.paths.indexOf(path) !== -1) return null;
        this.paths.push(path);
        return path;
    }

    remove(path) {
        validate(path);
        path = normalize(path);
        this.paths = this.paths.filter(item => item !== path);
    }

    exist(path) {
        if (this.paths.indexOf(path) !== -1) return true;
        else return false;
    }

    searchSubPath(path) {
        if (path[path.length - 1] !== "*") {
            if (this.exist(path)) return [path];
            else return [];
        }
        let cleanPath = path.replace("*", "");
        if (cleanPath[cleanPath.length - 1] === "/") {
            cleanPath = cleanPath.substring(0, cleanPath.length - 1);
        }
        return this.paths.filter(item => item.indexOf(cleanPath) === 0);
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
