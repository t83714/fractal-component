import * as is from "./utils/is";

export { is };

export function getPackageName(): string;

export function getPackageVersion(): string;

export function isDevMode(): boolean;

export function isInNode(): boolean;

export function getMachineInfo(): {
    pid?: number;
    macAddr?: string;
    macAddrInt?: number;
};

export function uniqid(prefix?: string): string;

export function log(message: string, level?: string, error?: any): void;

export function trim(v: string): void;

export function konst(v: any): () => any;
export function kTrue(v: any): () => boolean;
export function kFalse(v: any): () => boolean;
export function noop(): void;
export function identity(v: any): any;
export function createClassNameGenerator(): string;
export function symbolToString(s: symbol): string;
