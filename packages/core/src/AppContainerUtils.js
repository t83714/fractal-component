import AppContainer from "./AppContainer";
import { log } from "./utils";

let APP_CONTAINER_KEY = "__appContainer";
let defaultAppContainer = null;

export function createAppContainer(options = {}) {
    if (defaultAppContainer) {
        log(
            "AppContainerUtils.createAppContainer: Existing appContainer found. " +
                "The appContainer options supplied was ignored. " +
                "Existing appContainer will be used.",
            "warn"
        );
        return defaultAppContainer;
    }
    const ac = new AppContainer(options);
    defaultAppContainer = ac;
    return ac;
}

export function getAppContainer(componentInstance = null) {
    if (componentInstance) {
        if (
            componentInstance.props &&
            componentInstance.props[APP_CONTAINER_KEY]
        )
            return componentInstance.props[APP_CONTAINER_KEY];
        if (
            componentInstance.context &&
            componentInstance.context[APP_CONTAINER_KEY]
        )
            return componentInstance.context[APP_CONTAINER_KEY];
    }
    if (!defaultAppContainer) {
        defaultAppContainer = createAppContainer();
    }
    return defaultAppContainer;
}

export function registerComponent(componentInstance, options) {
    const appContainer = getAppContainer(componentInstance);
    return appContainer.registerComponent(componentInstance, options);
}

export function deregisterComponent(componentInstance) {
    const appContainer = getAppContainer(componentInstance);
    return appContainer.deregisterComponent(componentInstance);
}

export function registerSaga(saga, sagaOptions, componentInstance = null) {
    const appContainer = getAppContainer(componentInstance);
    return appContainer.sagaRegistry.register(saga, sagaOptions);
}

export function deregisterSaga(pathOrTask, componentInstance = null) {
    const appContainer = getAppContainer(componentInstance);
    return appContainer.sagaRegistry.deregister(pathOrTask);
}

export function registerReducer(
    reducer,
    reducerOptions,
    componentInstance = null
) {
    const appContainer = getAppContainer(componentInstance);
    return appContainer.reducerRegistry.register(reducer, reducerOptions);
}

export function deregisterReducer(path, componentInstance = null) {
    const appContainer = getAppContainer(componentInstance);
    return appContainer.reducerRegistry.deregister(path);
}

export function registerActions(namespace, actions, componentInstance = null) {
    const appContainer = getAppContainer(componentInstance);
    return appContainer.actionRegistry.register(namespace, actions);
}

export function serialiseAction(action, componentInstance = null) {
    const appContainer = getAppContainer(componentInstance);
    return appContainer.actionRegistry.serialiseAction(action);
}

export function deserialiseAction(actionJson, componentInstance = null) {
    const appContainer = getAppContainer(componentInstance);
    return appContainer.actionRegistry.deserialiseAction(actionJson);
}

export function findNamespaceByActionType(
    actionType,
    componentInstance = null
) {
    const appContainer = getAppContainer(componentInstance);
    return appContainer.actionRegistry.findNamespaceByActionType(actionType);
}

export function destroyAppContainer(componentInstance = null) {
    const appContainer = getAppContainer(componentInstance);
    appContainer.destroy();
    if (appContainer === defaultAppContainer) {
        defaultAppContainer = null;
    }
}

/**
 * Update AppContainerRetrieveKey
 * This key is used by AppContainerUtils for looking up `appContainer` instance
 * from either Component Instance props or context
 * @param {string} newKey
 * return Current key
 */
export function updateAppContainerRetrieveKey(newKey) {
    const currentKey = APP_CONTAINER_KEY;
    APP_CONTAINER_KEY = newKey;
    return currentKey;
}
