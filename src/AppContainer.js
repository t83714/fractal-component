import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import ComponentRegistry from "./ComponentRegistry";
import ReducerRegistry from "./ReducerRegistry";
import SagaRegistry from "./SagaRegistry";
import * as ReducerRegistryActionTypes from "./ReducerRegistry/actionTypes";

const defaultDevToolOptions = {
    actionsBlacklist: Object.keys(ReducerRegistryActionTypes).map(
        idx => ReducerRegistryActionTypes[idx]
    )
};
const defaultOptions = {
    reducer: null,
    initState: {},
    middlewares: [],
    reduxDevToolsDevOnly: true,
    //-- https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#windowdevtoolsextensionconfig
    devToolOptions: { ...defaultDevToolOptions },
    //-- https://redux-saga.js.org/docs/api/index.html#createsagamiddlewareoptions
    sagaMiddlewareOptions: {},
    isServerSideRendering: false
};

const getComposeEnhancers = function(devOnly, options) {
    /* eslint-disable-next-line no-underscore-dangle */
    if (!window || !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) return compose;
    if (devOnly && process.env.NODE_ENV === "production") return compose;
    const devToolOptions = {
        ...(options ? options : {})
    };
    /* eslint-disable-next-line no-underscore-dangle */
    return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolOptions);
};

class AppContainer {
    constructor(options = {}) {
        this.store = null;
        const containerCreationOptions = {
            ...defaultOptions,
            ...options
        };
        const composeEnhancers = getComposeEnhancers(
            containerCreationOptions.reduxDevToolsDevOnly,
            containerCreationOptions.devToolOptions
        );
        const sagaMiddleware = createSagaMiddleware(
            containerCreationOptions.sagaMiddlewareOptions
        );
        const middlewares = [
            ...containerCreationOptions.middlewares,
            sagaMiddleware
        ];
        this.eventEmitters = [];
        this.componentRegistry = new ComponentRegistry(this);
        this.reducerRegistry = new ReducerRegistry(this);
        this.SagaRegistry = new SagaRegistry();

        this.store = createStore(
            this.reducerRegistry.createGlobalReducer(containerCreationOptions.reducer),
            { ...containerCreationOptions.initState },
            composeEnhancers(applyMiddleware(...middlewares))
        );

        this.hostSagaTask = sagaMiddleware.run(
            this.SagaRegistry.createHostSaga()
        );
    }

    registerComponent(componentInstance, options){
        return this.componentRegistry.register(componentInstance, options);
    }

    deregisterComponent(componentInstance){
        this.componentRegistry.deregister(componentInstance);
    }

    destroy() {}
}

export default AppContainer;
