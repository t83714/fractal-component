import { EnhancerOptions } from "redux-devtools-extension";
import { SagaMiddlewareOptions } from "redux-saga";
import { Store } from "redux";
import ComponentRegistry from "./ComponentRegistry";

declare class AppContainer {
    constructor(options?: AppContainerOption);

    store: Store;
    componentRegistry: ComponentRegistry;

    getContextValue(): {
        appContainer: AppContainer;
        store: Store;
    };

    addChanEventLisenter(emitter: Emit<Action>): void;
    removeChanEventLisenter(emitter: Emit<Action>): void;
    sendChanEvent(event: { type: string; payload?: any }): void;
}

export default AppContainer;

export interface AppContainerOption {
    reducer?: (state: object, action: any) => object;
    initState?: object;
    middlewares?: [];
    reduxDevToolsDevOnly?: boolean;
    devToolOptions?: EnhancerOptions;
    sagaMiddlewareOptions?: SagaMiddlewareOptions;
    saga?: Generator;
}
