import AppContainer from "./AppContainer";
import { Action, Reducer, Store } from "redux";

declare class ReducerRegistry {
    constructor(appContainer: AppContainer);
    destroy(): void;

    store: Store;
    reducerStore: ReducerItem[];
    appContainer: AppContainer;

    register(reducer: Reducer, reducerOptions: ReducerOptions): void;
    deregister(path: string): void;
    createGlobalReducer(externalGlobalReducer: Reducer): Reducer;
}

export default ReducerRegistry;

export type Reducer = (state: object, action: Action) => object;

export interface ReducerOptions {
    initState?: object;
    path: string;
    namespace: string;
    persistState?: boolean;
    allowedIncomingMulticastActionTypes?: symbol[] | symbol | string;
}

export interface ReducerItem extends ReducerOptions {
    reducer: Reducer;
}
