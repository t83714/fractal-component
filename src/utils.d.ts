import { is as reduxSagaIs, GuardPredicate } from "redux-saga/utils";
import { Action } from "redux";

const extraIs: {
    bool: GuardPredicate<boolean>;
    symbol: GuardPredicate<symbol>;
    action: (v: any) => boolean;
    namespacedAction: (v: any) => boolean;
};

export const is: typeof extraIs & typeof reduxSagaIs;

export const getPackageName: () => string;

export const getPackageVersion: () => string;

export const isDevMode: () => boolean;

export const log: (message: string, level?: string, error?: any) => void;

export const trim: (v: string) => void;

export const konst: (v: any) => (() => any);
export const kTrue: (v: any) => (() => boolean);
export const kFalse: (v: any) => (() => boolean);
export const noop: () => void;
export const identity: (v: any) => any;
