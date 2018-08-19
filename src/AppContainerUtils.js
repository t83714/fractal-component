import AppContainer from "./AppContainer";
import { log } from "./utils";

let defaultAppContainer = null;

export function createAppContainer(options = {}) {
    if (defaultAppContainer) {
        log("AppContainerUtils.createAppContainer: Existing appContainer found. The appContainer options supplied was ignored. ", "warn");
        return defaultAppContainer;
    }
    const ac = new AppContainer(options);
    defaultAppContainer = ac;
    return ac;
}

export function getAppContainer() {
    if (!defaultAppContainer) {
        defaultAppContainer = createAppContainer();
    }
    return defaultAppContainer;
}

export function registerComponent(componentInstance, options) {
    const appContainer = getAppContainer();
    return appContainer.registerComponent(componentInstance, options);
}

export function deregisterComponent(componentInstance) {
    const appContainer = getAppContainer();
    return appContainer.deregisterComponent(componentInstance);
}

export function registerSaga(saga, sagaOptions) {
    const appContainer = getAppContainer();
    return appContainer.sagaRegistry.register(saga, sagaOptions);
}

export function deregisterSaga(pathOrTask) {
    const appContainer = getAppContainer();
    return appContainer.sagaRegistry.deregister(componentInstance);
}

export function registerReducer(reducer, reducerOptions) {
    const appContainer = getAppContainer();
    return appContainer.reducerRegistry.register(reducer, reducerOptions);
}

export function deregisterReducer(path) {
    const appContainer = getAppContainer();
    return appContainer.reducerRegistry.deregister(path);
}

export function registerActions(namespace, actions) {
    const appContainer = getAppContainer();
    return appContainer.actionRegistry.register(namespace, actions);
}

export function serialiseAction(action) {
    const appContainer = getAppContainer();
    return appContainer.actionRegistry.serialiseAction(action);
}

export function deserialiseAction(actionJson) {
    const appContainer = getAppContainer();
    return appContainer.actionRegistry.deserialiseAction(actionJson);
}

export function destroyAppContainer() {
    defaultAppContainer.destroy();
    defaultAppContainer = null;
}
