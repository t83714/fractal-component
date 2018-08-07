import AppContainer from "./AppContainer";

let defaultAppContainer = null;

export function createAppContainer(options) {
    const ac = new AppContainer(options);
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
    return appContainer.registerComponent(componentInstance, options);
}

export function destroyAppContainer() {
    defaultAppContainer.destroy();
    defaultAppContainer = null;
}
