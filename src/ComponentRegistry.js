import PathRegistry from "./PathRegistry";
import ComponentManager, { COMPONENT_MANAGER_LOCAL_KEY } from "./ComponentManager";
import { is } from "./utils";

const defaultOptions = {
    isServerSideRendering: false
};

class ComponentRegistry {
    constructor(appContainer, options = {}) {
        this.appContainer = appContainer;
        this.options = { ...defaultOptions, ...options };
        this.pathRegistry = new PathRegistry();
        this.componentManagerStore = {};
    }

    register(componentInstance, options) {
        const runTimeOptions = { ...this.options, ...options };
        const manager = new ComponentManager(componentInstance, runTimeOptions, this.appContainer.store);
        if (this.componentManagerStore[manager.fullPath]) {
            throw new Error(
                `Try to register component to an existing path: ${
                    manager.fullPath
                }`
            );
        }
        this.componentManagerStore[manager.fullPath] = manager;
        manager.enhanceComponentInstance(
            registerComponentManager.bind(this),
            deRegisterComponentManager.bind(this)
        );
        return manager;
    }

    deregister(componentInstance) {
        const cm = componentInstance[COMPONENT_MANAGER_LOCAL_KEY];
        if (!cm) return;
        deRegisterComponentManager.call(this, cm);
    }
}

function registerComponentManager(cm) {
    this.appContainer.reducerRegistry.register(cm.options.reducer, {
        initState: cm.initState,
        path: cm.fullPath,
        persistState: cm.persistState
    });
    if (cm.options.saga && is.func(cm.options.saga)) {
        this.appContainer.sagaRegistry.register(cm.options.saga, {
            path: cm.fullPath
        });
    }
}

function deRegisterComponentManager(cm) {
    this.appContainer.sagaRegistry.deregister(cm.fullPath);
    this.appContainer.reducerRegistry.deregister(cm.fullPath);
}

export default ComponentRegistry;
