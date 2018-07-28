import * as _ from "lodash";

class PathContext {
    constructor(cwd) {
        this.cwd = normalize(cwd);
        if (this.cwd.indexOf("*") !== -1)
            throw new Error("`cwd` cannot contains `*`");
        if (this.cwd.indexOf(".") !== -1) {
            this.cwd = this.compressPath(this.cwd, true);
        }
    }

    compressPath(paths, ignoreExcessDoubleDot = false) {
        const calculatedParts = [];
        paths.map(p => p.trim()).forEach(p => {
            if (p.indexOf("*") !== -1)
                throw new Error(
                    "Failed to resolve path: path segments cannot contain `*`"
                );
            p.split("/").forEach(item => {
                item = _.trim(item).toLowerCase();
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
}

class PathRegistry {
    constructor() {
        this.paths = [];
    }

    add(path) {
        if (path.indexOf("*") !== -1) {
            throw new Error("path cannot contain `*`");
        }
        path = normalize(path);
        if (_.indexOf(this.paths, path) !== -1) return;
        this.paths.push(path);
    }

    searchSubPath(path) {
        path = _.trim(path).toLowerCase();
        if (path[path.length - 1] !== "*") {
            return [];
        }
        let cleanPath = path.replace("*", "");
        if (cleanPath[cleanPath.length - 1] === "/") {
            cleanPath = cleanPath.substring(0, cleanPath.length - 1);
        }
        return _.filter(this.paths, item => item.indexOf(cleanPath) === 0);
    }
}

function normalize(path) {
    path = _.trim(path).toLowerCase();
    if (path[path.length - 1] === "/") {
        if (path.length === 1) {
            path = "";
        } else {
            path = path.substring(0, path.length - 1);
        }
    }
    return path;
}
