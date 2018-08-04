import AppContainer from "./AppContainer";
import { Store } from "redux";

declare class ReducerRegistry {
    constructor(appContainer: AppContainer);

    store: Store;
    reducerStore: ReducerItem[];
    appContainer: AppContainer;

    register(reducer: Reducer, reducerOptions: ReducerOptions): void;
    deregister(path: string): void;
    createGlobalReducer(
        externalGlobalReducer: (object, object) => object = null
    ): (object, object) => state;
}

export default ReducerRegistry;

export type Reducer = (state: object, action: any) => object;

export interface ReducerOptions {
    reducer: Reducer;
    initState?: object;
    path: string;
    initStateAlwaysOverwrite?: boolean;
}

export interface ReducerItem extends ReducerOptions {
    reducer: (state: object, action: any) => object;
}
