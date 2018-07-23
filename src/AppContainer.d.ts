import { EnhancerOptions } from "redux-devtools-extension";
import { SagaMiddlewareOptions } from "redux-saga";
import { Store } from "redux";

export = AppContainer;

declare class AppContainer {
    constructor(options?: AppContainer.AppContainerOption);

    store: Store;

    getContextValue(): {
        appContainer: AppContainer;
        store: Store;
    };

    addChanEventLisenter(emitter: Emit<Action>): void;
    removeChanEventLisenter(emitter: Emit<Action>): void;
    sendChanEvent(event: { type: string; payload?: any }): void;
}

declare namespace AppContainer {
    export interface AppContainerOption {
        reducer?: (state: object, action: any) => object;
        initState?: object;
        middlewares?: [];
        reduxDevToolsDevOnly?: boolean;
        devToolOptions?: EnhancerOptions;
        sagaMiddlewareOptions?: SagaMiddlewareOptions;
        saga?: Generator;
    }
}
