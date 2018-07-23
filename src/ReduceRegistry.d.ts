import AppContainer from "./AppContainer";

/*~ This declaration specifies that the class constructor function
 *~ is the exported object from the file
 */

export = ReducerRegistry;

declare class ReducerRegistry {
    constructor(appContainer: AppContainer);
    appContainer: AppContainer;
    addReducer(reducerItem: ReducerRegistry.ReducerItem): void;
}

declare namespace ReducerRegistry {
    export interface ReducerItem {
        reducer: (state: object, action: any) => object;
        initState?: object;
        path: string;
    }
}
