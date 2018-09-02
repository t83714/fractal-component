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
    destroy(): void;
    add(path: string, data?: object): string;
    remove(path: string): void;
    exist(path: string): boolean;
    searchSubPath(path: string): string[];
    remove(path: string): void;
    getPathData(path: string): object;
    setPathData(path: string, data: object): void;
    mergePathData(path: string, data: object): void;
    foreach(iteratee: (data: object, path: string) => void): void;
    map(iteratee: (data: object, path: string) => any): any[];
    removePathData(path: string): void;
    isAllowedMulticast(path: string, actionType: symbol): boolean;
    searchDispatchPaths(action: Action): string[];
}

export default PathRegistry;

export declare const NAMESPACED: symbol;
export declare function validate(path: string): void;
export declare function normalize(path: string): string;
