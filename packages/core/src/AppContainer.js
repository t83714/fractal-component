import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import ComponentRegistry from "./ComponentRegistry";
import ReducerRegistry from "./ReducerRegistry";
import SagaRegistry from "./SagaRegistry";
import ActionRegistry from "./ActionRegistry";
import NamespaceRegistry from "./NamespaceRegistry";
import * as ReducerRegistryActionTypes from "./ReducerRegistry/actionTypes";
import * as SagaRegistryActionTypes from "./SagaRegistry/actionTypes";
import { isDevMode } from "./utils";

const actionBlackList = Object.keys(ReducerRegistryActionTypes)
    .map(idx => ReducerRegistryActionTypes[idx])
    .concat(
        Object.keys(SagaRegistryActionTypes).map(
            idx => SagaRegistryActionTypes[idx]
        )
    );
const defaultDevToolOptions = {
    actionSanitizer: action => ({ ...action, type: String(action.type) }),
    predicate: (state, action) => {
        return action && actionBlackList.indexOf(action.type) === -1;
    }
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
    if (
        typeof window !== "object" ||
        !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    )
        return compose;
    if (devOnly && !isDevMode()) return compose;
    const devToolOptions = {
        ...(options ? options : {})
    };
    /* eslint-disable-next-line no-underscore-dangle */
    return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolOptions);
};

class AppContainer {
    constructor(options = {}) {
        this.store = null;
        this.actionRegistry = new ActionRegistry();
        this.namespaceRegistry = new NamespaceRegistry(this);
        const containerCreationOptions = {
            ...defaultOptions,
            ...options
        };
        if(options && options.devToolOptions){
            containerCreationOptions.devToolOptions = {
                ...defaultDevToolOptions,
                ...options.devToolOptions
            }
        }
        const composeEnhancers = getComposeEnhancers(
            containerCreationOptions.reduxDevToolsDevOnly,
            containerCreationOptions.devToolOptions
        );
        const sagaMiddleware = createSagaMiddleware(
            containerCreationOptions.sagaMiddlewareOptions
        );
        const middlewares = [
            ...containerCreationOptions.middlewares,
            /**
             * Make sure `sagaMiddleware` is the last in the list
             * Therefore, reducers are run before saga.
             */
            sagaMiddleware
        ];
        this.eventEmitters = [];
        this.componentRegistry = new ComponentRegistry(this, {
            isServerSideRendering:
                containerCreationOptions.isServerSideRendering
        });
        this.reducerRegistry = new ReducerRegistry(this);
        this.sagaRegistry = new SagaRegistry(this);
        this.store = createStore(
            this.reducerRegistry.createGlobalReducer(
                containerCreationOptions.reducer
            ),
            { ...containerCreationOptions.initState },
            composeEnhancers(applyMiddleware(...middlewares))
        );

        this.hostSagaTask = sagaMiddleware.run(
            this.sagaRegistry.createHostSaga()
        );
    }

    registerComponent(componentInstance, options) {
        return this.componentRegistry.register(componentInstance, options);
    }

    deregisterComponent(componentInstance) {
        this.componentRegistry.deregister(componentInstance);
    }

    destroy() {
        this.componentRegistry.destroy();
    }
}

export default AppContainer;
