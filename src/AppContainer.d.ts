import { EnhancerOptions } from "redux-devtools-extension";
import { SagaMiddlewareOptions } from "redux-saga";
import { Store } from "redux";
import ComponentRegistry from "./ComponentRegistry";
import ReducerRegistry from "./ReducerRegistry";
import PathRegistry from "./PathRegistry";
import SagaRegistry from "./SagaRegistry";

declare class AppContainer {
    constructor(options?: AppContainerOption);

    store: Store;
    componentRegistry: ComponentRegistry;
    reducerRegistry: ReducerRegistry;
    sagaRegistry: SagaRegistry;
}

export default AppContainer;

export interface AppContainerOption {
    reducer?: (state: object, action: any) => object;
    initState?: object;
    middlewares?: [];
    reduxDevToolsDevOnly?: boolean;
    devToolOptions?: EnhancerOptions;
    sagaMiddlewareOptions?: SagaMiddlewareOptions;
    isServerSideRendering?: boolean;
}
