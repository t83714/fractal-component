import AppContainer from "./AppContainer";
import { Reducer } from "./ReducerRegistry";
import ComponentManager from "./ComponentManager";
import { Action } from "redux";
import PathRegistry from "./PathRegistry";

declare class SharedStateContainer {
    constructor(options: SharedStateContainerOptions);

    options: SharedStateContainerOptions;
    actionTypes: symbol[];
    namespace: string;

    appContainer: AppContainer;

    initState: any;

    isInitialized: boolean;
    fullPath: string;
    pathRegistry: PathRegistry;

    getStoreState(): any;
    registerConsumer(
        localKey: string,
        componentManager: ComponentManager
    ): void;
    deregisterConsumer(componentManager: ComponentManager): void;
    supportActionType(actionType: symbol): boolean;
    supportAction(action: Action): boolean;
    destroy(): void;
}

export interface SharedStateContainerOptions {
    initState: object;
    /**
     * SharedState is created as a no UI `fractal-component` component behind the scenes.
     * Thus, users are required to nominate a `namespace` to make sure its reducer & actions are namespaced.
     */
    namespace: string;
    /**
     * Provide all action types used by your SharedState component reducer
     * to make sure actions of those types are serializable
     * via: AppContainer.serialiseAction / AppContainer.deserialiseAction
     * Either provided as array (symbol[]) or object hash
     * (i.e.
     *  {
     *    string : symbol,
     *    string : symbol
     *    ...
     *  }
     * ).
     */
    actionTypes?: symbol[] | object;
    reducer: Reducer;
    forceOverwriteInitialState?: boolean;
    cleanStateDuringDestroy?: boolean;
}

export default SharedStateContainer;
