import { Action } from "redux";

export declare class PathContext {
    constructor(cwd: string);
    cwd: string;
    getLastSegment(): string;
    compressPath(
        paths: string[] | string,
        ignoreExcessDoubleDot?: boolean
    ): string;
    convertNamespacedAction(
        action: Action,
        relativeDispatchPath: string
    ): Action;
    resolve(...paths: string[]): string;
}

declare class PathRegistry {
    constructor();
    add(path: string, data?: object): string;
    remove(path: string): void;
    exist(path: string): boolean;
    searchSubPath(path: string): string[];
    remove(path: string): void;
    getPathData(path: string): object;
    setPathData(path: string, data: object);
    searchPathByPathData(predictFunc: (any) => boolean): string;
}

export default PathRegistry;

export declare const NAMESPACED: symbol;
export declare function validate(path: string): void;
export declare function normalize(path: string): string;
