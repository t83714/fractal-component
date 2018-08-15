import { Action } from "redux";

export declare class PathContext {
    constructor(cwd: string);
    cwd: string;
    getLastSegment(): string;
    compressPath(
        paths: string[] | string,
        ignoreExcessDoubleDot: boolean = true
    ): string;
    convertNamespacedAction(
        action: Action,
        relativeDispatchPath: string
    ): Action;
    resolve(...paths: string): string;
}

declare class PathRegistry {
    constructor();
    add(path: string): string;
    remove(path: string): void;
    exist(path: string): boolean;
    searchSubPath(path: string): string[];
    remove(path: string): void;
}

export default PathRegistry;

export declare const NAMESPACED: symbol;
export declare function validate(path: string): void;
export declare function normalize(path: string): string;
