import { EnhancerOptions } from "redux-devtools-extension";
import { SagaMiddlewareOptions } from "redux-saga";
import { Store, Middleware, Action } from "redux";
import ComponentRegistry from "./ComponentRegistry";
import ReducerRegistry from "./ReducerRegistry";
import PathRegistry from "./PathRegistry";
import SagaRegistry from "./SagaRegistry";
import ActionRegistry from "./ActionRegistry";
import NamespaceRegistry from "./NamespaceRegistry";
import {
    ManageableComponent,
    ManageableComponentOptions
} from "./ComponentManager";
import ComponentManager from "./ComponentManager";

declare class AppContainer {
    constructor(options?: AppContainerOptions);

    store: Store;
    componentRegistry: ComponentRegistry;
    reducerRegistry: ReducerRegistry;
    sagaRegistry: SagaRegistry;
    actionRegistry: ActionRegistry;
    namespaceRegistry: NamespaceRegistry;

    registerComponent(
        componentInstance: ManageableComponent,
        options?: ManageableComponentOptions
    ): ComponentManager;
    deregisterComponent(componentInstance: ManageableComponent): void;
    destroy(): void;
    /**
     * This function is mainly used for server side rendering.
     * i.e. To decide to when the initial data loading is finised
     * and when it is ready to create a snapshot of the redux store
     * via appContainer.store.getState()
     *
     * You shouldn't need it for implmenting any logic
     *
     */
    subscribeActionDispatch(func: (action: Action) => void): void;

    // --- an utility mainly designed for server side rendering.
    waitForActionsUntil(
        testerFunc: (action: Action) => boolean,
        timeout?: number
    ): Promise<void>;

    /**
     * This function is mainly used for server side rendering.
     * i.e. Send out actions (if necessary) to trigger initial data loading
     *
     * You shouldn't need it for implmenting any logic
     *
     */
    dispatch(action: Action, relativeDispatchPath?: string): Action;
}

export default AppContainer;

export interface AppContainerOptions {
    reducer?: (state: object, action: any) => object;
    initState?: object;
    middlewares?: Middleware[];
    reduxDevToolsDevOnly?: boolean;
    devToolOptions?: EnhancerOptions;
    sagaMiddlewareOptions?: SagaMiddlewareOptions;
    isServerSideRendering?: boolean;
}
