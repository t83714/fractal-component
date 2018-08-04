let isDevMode = false;
if (
    process &&
    process.env &&
    process.env.NODE_ENV &&
    process.env.NODE_ENV === "development"
) {
    isDevMode = true;
}

export function isDevMode() {
    return isDevMode;
}

export function log(message, level = "log", error = "") {
    /*eslint-disable no-console*/
    if (typeof window === "undefined") {
        console.log(
            `fractal-component ${level}: ${message}\n${(error && error.stack) ||
                error}`
        );
    } else {
        console[level](message, error);
    }
}
