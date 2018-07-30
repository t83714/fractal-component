import { AppContainer } from "./AppContainer";
import { Store } from "redux";

declare class ReducerRegistry {
    constructor(store: Store);
    store: Store;
    addReducer(reducerItem: ReducerItem): void;
}

export default ReducerRegistry;

export interface ReducerItem {
    reducer: (state: object, action: any) => object;
    initState?: object;
    path: string;
    overwriteInitState?: boolean;
}
