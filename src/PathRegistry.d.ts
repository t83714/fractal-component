export declare class PathContext {
    constructor(cwd: string);
    compressPath(
        paths: string[],
        ignoreExcessDoubleDot: boolean = false
    ): string;
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

export declare function validate(path:string):void;
export declare function normalize(path:string):string;

