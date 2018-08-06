import AppContainer from "./AppContainer";

const defaultAppContainer = null;

export function createAppContainer(options) {
    const ac = new AppContainer(options);
    currentAppContainerToken = Symbol("APP_CONTAINER_TOKEN");
    defaultAppContainer = ac;
    return ac;
}

export function getAppContainer() {
    if (!defaultAppContainer) {
        throw new Error(
            "App Container is not available. You need to create one via `createAppContainer` first."
        );
    }
    return defaultAppContainer;
}

export function registerComponent(componentInstance, options) {
    const appContainer = getAppContainer();
    appContainer.componentRegistry.register(componentInstance, options);
}

export function destroyAppContainer() {
    defaultAppContainer.destroy();
    defaultAppContainer = null;
}
