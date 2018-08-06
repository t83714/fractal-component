import { EnhancerOptions } from "redux-devtools-extension";
import { SagaMiddlewareOptions } from "redux-saga";
import { Store } from "redux";
import ComponentRegistry from "./ComponentRegistry";
import ReducerRegistry from "./ReducerRegistry";
import PathRegistry from "./PathRegistry";
import SagaRegistry from "./SagaRegistry";
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
    registerComponent(
        componentInstance: ManageableComponent,
        options?: ManageableComponentOptions
    ): ComponentManager;
    deregisterComponent(omponentInstance: ManageableComponent): void;
}

export default AppContainer;

export interface AppContainerOptions {
    reducer?: (state: object, action: any) => object;
    initState?: object;
    middlewares?: [];
    reduxDevToolsDevOnly?: boolean;
    devToolOptions?: EnhancerOptions;
    sagaMiddlewareOptions?: SagaMiddlewareOptions;
    isServerSideRendering?: boolean;
}
