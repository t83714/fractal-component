import * as actionTypes from "./ReducerRegistry/actionTypes";
import * as actions from "./ReducerRegistry/actions";
import PathRegistry, { normalize } from "./PathRegistry";
import objectPath from "object-path";
import objectPathImmutable from "object-path-immutable";

const defaultReducerOptions = {
    initState: {},
    persistState: false
};

/**
 * This function should NOT return a new state copy
 */
function processInitState(state, action) {
    const { data, persistState, path } = action.payload;
    const pathItems = path.split("/");
    const doNotReplace = persistState;
    const hasData = objectPath.has(state, pathItems);
    if (hasData) {
        if (doNotReplace) return state;
        else return objectPathImmutable.set(state, pathItems, data);
    } else {
        return objectPathImmutable.set(state, pathItems, data);
    }
}

/**
 * This function should NOT return a new state copy
 */
function processEmptyState(state, action) {
    const path = action.payload;
    const pathItems = path.split("/");
    return objectPathImmutable.del(state, pathItems);
}

function processNamespacedAction(state, action) {
    const lastSepIdx = action.type.lastIndexOf("/@");
    if (lastSepIdx === -1) return state;
    const pureAction = action.type.substring(lastSepIdx + 2);
    const path = normalize(action.type.substring(0, lastSepIdx));
    const matchedPaths = this.pathRegistry.searchSubPath(path);
    if (!matchedPaths || !matchedPaths.length) return state;
    const newAction = { ...action, type: pureAction, originType: action.type };
    let newState = state;
    matchedPaths.forEach(p => {
        const { reducer } = this.reducerStore[p];
        if (!reducer || typeof reducer !== "function") return;
        const pathItems = p.split("/");
        const componentState = objectPath.set(state, pathItems);
        const newComponentState = reducer(componentState, newAction);
        if (componentState === newComponentState) {
            //--- skip update when no changes; likely not interested action
            return;
        } else {
            newState = objectPathImmutable.set(
                newState,
                pathItems,
                newComponentState
            );
        }
    });
    return newState;
}

function globalReducer(externalGlobalReducer, state, action) {
    if (!action || !action.type) return state;
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
        this.pathRegistry = new PathRegistry();
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

        const { path, initState, persistState } = reducerOptions;

        if (!path)
            throw new Error(
                "Failed to register namespaced reducer: namespace path cannot be empty!"
            );

        const registeredPath = normalize(path);
        if (this.pathRegistry.add(registeredPath) === null) {
            throw new Error(
                `Failed to register namespaced reducer: given path \`${registeredPath}\` has been registered.`
            );
        }

        this.reducerStore[registeredPath] = {
            ...reducerOptions,
            reducer,
            persistState,
            initState,
            registeredPath
        };

        setInitState.call(
            this,
            registeredPath,
            initState,
            persistState
        );
    }

    deregister(path) {
        const normalizedPath = normalize(path);
        this.pathRegistry.remove(normalizedPath);
        const reduceItem = this.reducerStore[normalizedPath];
        if (!reduceItem) return;
        delete this.reducerStore[normalizedPath];
        const { persistState } = reduceItem;
        if (persistState) return;
        emptyInitState.call(this, normalizedPath);
    }
}

function setInitState(path, initState, persistState) {
    if (!this.appContainer.store)
        throw new Error(
            "Failed to set init state for component reducer: redux store not available yet!"
        );
    this.appContainer.store.dispatch(
        actions.initState(path, initState, persistState)
    );
}

function emptyInitState(path) {
    if (!this.appContainer.store)
        throw new Error(
            "Failed to set init state for component reducer: redux store not available yet!"
        );
    this.store.dispatch(actions.emptyState(path));
}

export default ReducerRegistry;
