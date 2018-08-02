import AppContainer from "./AppContainer";
import { Store } from "redux";

declare class ReducerRegistry {
    constructor(appContainer: AppContainer);

    store: Store;
    reducerStore: ReducerItem[];
    appContainer: AppContainer;

    addReducer(reducerItem: ReducerItem): void;
    register(reducerItem: ReducerItem): void;
    deregister(path: string): void;
    createGlobalReducer(
        externalGlobalReducer: (object, object) => object = null
    ): (object, object) => state;
}

export default ReducerRegistry;

export interface ReducerItem {
    reducer: (state: object, action: any) => object;
    initState?: object;
    path: string;
    overwriteInitState?: boolean;
}
