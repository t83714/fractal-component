export declare class PathContext {
    constructor(cwd: string);
    compressPath(
        paths: string[],
        ignoreExcessDoubleDot: boolean = false
    ): string;
    resolve(...paths: string): string;
}

export declare class PathRegistry{
    constructor();
}

