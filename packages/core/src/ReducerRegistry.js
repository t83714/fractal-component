import * as actionTypes from "./ReducerRegistry/actionTypes";
import * as actions from "./ReducerRegistry/actions";
import PathRegistry, { normalize } from "./PathRegistry";
import { is } from "./utils";
import namespace from "./ReducerRegistry/namespace";

const defaultReducerOptions = {
    initState: {},
    forceOverwriteInitialState: false,
    cleanStateDuringDestroy: true
};

/**
 * This function should NOT return a new state copy
 */
function processInitState(state, action) {
    const { data, forceOverwriteInitialState, path } = action.payload;
    const hasData = !is.undef(state[path]);
    if (hasData && !forceOverwriteInitialState) return state;
    return { ...state, [path]: data };
}

/**
 * This function should NOT return a new state copy
 */
function processEmptyState(state, action) {
    const { path } = action.payload;
    const newState = { ...state };
    delete newState[path];
    return newState;
}

function processNamespacedAction(state, action) {
    if (!is.namespacedAction(action)) return state;
    const matchedPaths = this.pathRegistry.searchDispatchPaths(action);
    if (!matchedPaths || !matchedPaths.length) return state;
    let newState = state;
    matchedPaths.forEach(p => {
        const { reducer } = this.reducerStore[p];
        if (!reducer || typeof reducer !== "function") return;
        const componentState = state[p];
        const newComponentState = reducer(componentState, action);
        if (componentState === newComponentState) {
            //--- skip update when no changes; likely not interested action
            return;
        } else {
            newState = {
                ...newState,
                [p]: newComponentState
            };
        }
    });
    return newState;
}

function globalReducer(externalGlobalReducer, state, action) {
    if (!is.action(action)) return state;
    let newState = state;
    switch (action.type) {
        case actionTypes.INIT_STATE:
            newState = processInitState(newState, action);
            break;
        case actionTypes.EMPTY_STATE:
            newState = processEmptyState(newState, action);
            break;
    }
    newState = processNamespacedAction.call(this, newState, action);
    if (externalGlobalReducer && typeof externalGlobalReducer === "function") {
        newState = externalGlobalReducer(newState, action);
    }
    return newState;
}

class ReducerRegistry {
    constructor(appContainer) {
        this.appContainer = appContainer;
        this.reducerStore = {};
        this.pathRegistry = new PathRegistry(true);
        this.appContainer.actionRegistry.register(namespace, actionTypes);
    }

    destroy() {
        this.pathRegistry.destroy();
        this.appContainer = null;
    }

    createGlobalReducer(externalGlobalReducer = null) {
        return globalReducer.bind(this, externalGlobalReducer);
    }

    register(reducer, reducerOptions) {
        if (!reducer || typeof reducer !== "function")
            throw new Error(
                "Failed to register reducer: invalid reducer parameter."
            );
        if (!reducerOptions) reducerOptions = { ...defaultReducerOptions };

        const {
            path,
            namespace,
            initState,
            forceOverwriteInitialState,
            cleanStateDuringDestroy,
            allowedIncomingMulticastActionTypes
        } = reducerOptions;

        if (!path)
            throw new Error(
                "Failed to register namespaced reducer: namespace path cannot be empty!"
            );

        const registeredPath = normalize(path);
        const localPathPos = namespace
            ? registeredPath.lastIndexOf(namespace)
            : registeredPath.length;

        if (
            this.pathRegistry.add(registeredPath, {
                localPathPos,
                namespace,
                allowedIncomingMulticastActionTypes
            }) === null
        ) {
            throw new Error(
                `Failed to register namespaced reducer: given path \`${registeredPath}\` has been registered.`
            );
        }

        this.reducerStore[registeredPath] = {
            ...reducerOptions,
            reducer,
            initState,
            forceOverwriteInitialState,
            cleanStateDuringDestroy,
            allowedIncomingMulticastActionTypes,
            path: registeredPath
        };

        setInitState.call(
            this,
            registeredPath,
            initState,
            forceOverwriteInitialState
        );
    }

    deregister(path) {
        const normalizedPath = normalize(path);
        this.pathRegistry.remove(normalizedPath);
        const reduceItem = this.reducerStore[normalizedPath];
        if (!reduceItem) return;
        delete this.reducerStore[normalizedPath];
        const { cleanStateDuringDestroy } = reduceItem;
        if (!cleanStateDuringDestroy) return;
        emptyInitState.call(this, normalizedPath);
    }
}

function setInitState(path, initState, forceOverwriteInitialState) {
    if (!this.appContainer.store)
        throw new Error(
            "Failed to set initial state for component: redux store not available yet!"
        );
    this.appContainer.store.dispatch(
        actions.initState(path, initState, forceOverwriteInitialState)
    );
}

function emptyInitState(path) {
    if (!this.appContainer.store)
        throw new Error(
            "Failed to clean component state: redux store not available yet!"
        );
    this.appContainer.store.dispatch(actions.emptyState(path));
}

export default ReducerRegistry;
