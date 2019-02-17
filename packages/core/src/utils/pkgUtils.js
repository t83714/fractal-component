import pkg from "../../package.json";

export const getPackageName = function() {
    return pkg.name;
};

export const getPackageVersion = function() {
    return pkg.version;
};