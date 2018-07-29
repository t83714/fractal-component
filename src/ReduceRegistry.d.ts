import { AppContainer } from "./AppContainer";

declare class ReducerRegistry {
    constructor(appContainer: AppContainer);
    appContainer: AppContainer;
    addReducer(reducerItem: ReducerItem): void;
}

export default ReducerRegistry;

export interface ReducerItem {
    reducer: (state: object, action: any) => object;
    initState?: object;
    path: string;
}

