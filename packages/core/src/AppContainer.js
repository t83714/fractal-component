import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import ComponentRegistry from "./ComponentRegistry";
import ReducerRegistry from "./ReducerRegistry";
import SagaRegistry from "./SagaRegistry";
import SagaMonitorRegistry from "./SagaMonitorRegistry";
import { PathContext } from "./PathRegistry";
import ActionRegistry from "./ActionRegistry";
import NamespaceRegistry from "./NamespaceRegistry";
import * as ReducerRegistryActionTypes from "./ReducerRegistry/actionTypes";
import * as SagaRegistryActionTypes from "./SagaRegistry/actionTypes";
import { isDevMode, log, is, symbolToString } from "./utils";
import ComponentManager from "./ComponentManager";

const actionBlackList = Object.keys(ReducerRegistryActionTypes)
    .map(idx => ReducerRegistryActionTypes[idx])
    .concat(
        Object.keys(SagaRegistryActionTypes).map(
            idx => SagaRegistryActionTypes[idx]
        )
    );
const defaultDevToolOptions = {
    actionSanitizer: action => ({
        ...action,
        type: is.symbol(action.type) ? symbolToString(action.type) : action.type
    }),
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

export const APP_CONTAINER_SYMBOL = Symbol("APP_CONTAINER_SYMBOL");

class AppContainer {
    constructor(options = {}) {
        this.__APP_CONTAINER_SYMBOL = APP_CONTAINER_SYMBOL;
        this.store = null;
        this.sagaMonitorRegistry = new SagaMonitorRegistry();
        this.actionRegistry = new ActionRegistry();
        this.namespaceRegistry = new NamespaceRegistry(this);
        const containerCreationOptions = {
            ...defaultOptions,
            ...options
        };
        if (options && options.devToolOptions) {
            containerCreationOptions.devToolOptions = {
                ...defaultDevToolOptions,
                ...options.devToolOptions
            };
        }
        const composeEnhancers = getComposeEnhancers(
            containerCreationOptions.reduxDevToolsDevOnly,
            containerCreationOptions.devToolOptions
        );
        const sagaMiddleware = createSagaMiddleware({
            ...containerCreationOptions.sagaMiddlewareOptions,
            sagaMonitor: this.sagaMonitorRegistry.getCombinedMonitor()
        });
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
        return new ComponentManager(componentInstance, options, this);
    }

    deregisterComponent(componentInstance) {
        const cm = this.componentRegistry.retrieveComponentManager(componentInstance);
        cm.deregister();
    }

    /**
     * This function is mainly used for server side rendering.
     * i.e. To decide to when the initial data loading is finised
     * and when it is ready to create a snapshot of the redux store
     * via appContainer.store.getState()
     *
     * You shouldn't need it for implmenting any logic
     *
     */
    subscribeActionDispatch(func) {
        this.sagaMonitorRegistry.register({
            actionDispatched: func
        });
    }

    // --- an utility mainly designed for server side rendering.
    waitForActionsUntil(testerFunc, timeout = 5000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const error = new Error("waitForActionsUntil timeout");
                error.isTimeout = true;
                reject(error);
            }, timeout);
            this.subscribeActionDispatch(action => {
                if (testerFunc(action)) {
                    resolve();
                }
            });
        });
    }

    /**
     * This function is mainly used for server side rendering.
     * i.e. Send out actions (if necessary) to trigger initial data loading
     *
     * You shouldn't need it for implmenting any logic
     *
     */
    dispatch(action, relativeDispatchPath = "") {
        const pc = new PathContext("");
        const namespacedAction = pc.convertNamespacedAction(
            action,
            relativeDispatchPath
        );

        // --- query action Type's original namespace so that it can be serialised correctly if needed
        const namespace = this.actionRegistry.findNamespaceByActionType(
            namespacedAction.type
        );
        if (!namespace) {
            log(
                `Cannot locate namespace for Action \`${symbolToString(namespacedAction.type)}\`: \`${symbolToString(namespacedAction.type)}\` needs to be registered otherwise the action won't be serializable.`
            );
        } else {
            namespacedAction.namespace = namespace;
        }

        return this.store.dispatch(namespacedAction);
    }

    destroy() {
        this.componentRegistry.destroy();
        if (this.hostSagaTask) {
            this.hostSagaTask.cancel();
            this.hostSagaTask = null;
        }
        this.sagaRegistry.destroy();
        this.reducerRegistry.destroy();
        this.sagaMonitorRegistry.destroy();
        this.actionRegistry.destroy();
        this.namespaceRegistry.destroy();
    }
}

export default AppContainer;
