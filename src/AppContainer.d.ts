import { EnhancerOptions } from "redux-devtools-extension";
import { SagaMiddlewareOptions } from "redux-saga";
import { Store, Middleware } from "redux";
import ComponentRegistry from "./ComponentRegistry";
import ReducerRegistry from "./ReducerRegistry";
import PathRegistry from "./PathRegistry";
import SagaRegistry from "./SagaRegistry";
import ActionRegistry from "./ActionRegistry";
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
    
    registerComponent(
        componentInstance: ManageableComponent,
        options?: ManageableComponentOptions
    ): ComponentManager;
    deregisterComponent(componentInstance: ManageableComponent): void;
    destroy(): void;
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
