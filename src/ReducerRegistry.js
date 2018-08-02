import { addReducer } from "./ReducerRegistry/actions";
import * as actionTypes from "./ReducerRegistry/actionTypes";
import { normalize } from "./PathRegistry";
import objectPath from "object-path";
import objectPathImmutable from "object-path-immutable";
import partialRight from "lodash/partialRight";

/**
 * This function should NOT return a new state copy
 */
function processInitValue(state, action) {
    const { data, isOverwrite, path } = action.payload;
    const pathItems = path.split("/");
    isOverwrite = isOverwrite === false ? false : true;
    objectPath.set(state, pathItems, !isOverwrite);
    return state;
}

/**
 * This function should NOT return a new state copy
 */
function processEmptyValue(state, action) {
    const { isOverwrite, path } = action.payload;
    const pathItems = path.split("/");
    objectPath.empty(state, pathItems);
    return state;
}

function processNamespacedAction(state, action) {
    const lastSepIdx = action.type.lastIndexOf("/@");
    if (lastSepIdx === -1) return state;
    const pureAction = action.type.subString(lastSepIdx + 2);
    const path = normalize(action.type.subString(0, lastSepIdx));
    const matchedPaths = this.appContainer.pathRegistry.searchSubPath(path);
    if (!matchedPaths || !matchedPaths.length) return state;
    const newAction = { ...action, type: pureAction, originType: action.type };
    let newState = state;
    matchedPaths.forEach(p => {
        const { reducer } = this.reducerStore[p];
        if (!reducer || typeof reducer !== "function") return;
        newState = objectPathImmutable.update(newState, p.split("/"), partialRight(reducer,newAction))
    });
    return newState;
}

function globalReducer(externalGlobalReducer, state, action) {
    if (!action || !action.type) return state;
    let newState = state;
    switch (action.type) {
        case actionTypes.INIT_VALUE:
            newState = processInitValue(newState, action);
            break;
        case actionTypes.EMPTY_VALUE:
            newState = processEmptyValue(newState, action);
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
        this.reducerStore = {};
    }

    createGlobalReducer(externalGlobalReducer = null) {
        return globalReducer.bind(this, externalGlobalReducer);
    }

    register(reducerItem) {
        const { path, initState, reducer, overwriteInitState } = reducerItem;
        if (typeof overwriteInitState !== "boolean") overwriteInitState = true;
        if (!initState) initState = {};
        if (!path)
            throw new Error(
                "Failed to register namespaced reducer: namespace path cannot be empty!"
            );
        path = normalize(path);
        if (this.reducerStore[path])
            throw new Error(
                `Failed to register namespaced reducer: given path \`${path}\` has been registered.`
            );

        this.reducerStore[path] = {
            ...reducerItem,
            overwriteInitState,
            initState,
            path
        };

        setInitState.call(this, path, initState, overwriteInitState);
    }

    deregister(path) {
        path = normalize(path);
        const reduceItem = this.reducerStore[path];
        if (!reduceItem) return;
        const { overwriteInitState } = reduceItem;
        emptyInitState.call(this, path, overwriteInitState);
    }
}

function setInitState(path, initState, overwriteInitState) {
    if (!this.appContainer.store)
        throw new Error(
            "Failed to set init state for component reducer: redux store not available yet!"
        );
    this.store.dispatch({
        type: actionTypes.INIT_VALUE,
        payload: {
            data: initState,
            isOverwrite: overwriteInitState,
            path: path
        }
    });
}

function emptyInitState(path, overwriteInitState) {
    if (!this.appContainer.store)
        throw new Error(
            "Failed to set init state for component reducer: redux store not available yet!"
        );
    this.store.dispatch({
        type: actionTypes.EMPTY_VALUE,
        payload: {
            isOverwrite: overwriteInitState,
            path: path
        }
    });
}
