import PathRegistry from "./PathRegistry";
import ComponentManager, {
    COMPONENT_MANAGER_LOCAL_KEY
} from "./ComponentManager";
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
        this.componentAutoIdCounter = {};
    }

    createComponentId(...pathItems) {
        const path = pathItems.filter(item => (item ? true : false)).join("/");
        if (is.number(this.componentAutoIdCounter[path])) {
            this.componentAutoIdCounter[path] += 1;
        } else {
            this.componentAutoIdCounter[path] = 0;
        }
        return "c" + this.componentAutoIdCounter[path];
    }

    register(componentInstance, options) {
        const runTimeOptions = { ...this.options, ...options };
        const manager = new ComponentManager(
            componentInstance,
            runTimeOptions,
            this.appContainer
        );
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
        this.appContainer.namespaceRegistry.registerComponentManager(manager);
        return manager;
    }

    deregister(componentInstance) {
        const cm = componentInstance[COMPONENT_MANAGER_LOCAL_KEY];
        if (!cm) return;
        deRegisterComponentManager.call(this, cm);
    }

    destroy() {
        Object.values(this.componentManagerStore).map(cm => cm.destroy());
    }
}

function registerComponentManager(cm) {
    if (cm.options.reducer && is.func(cm.options.reducer)) {
        this.appContainer.reducerRegistry.register(
            cm.options.reducer.bind(cm.componentInstance),
            {
                initState: cm.initState,
                path: cm.fullPath,
                namespace: cm.namespace,
                persistState: cm.persistState,
                allowedIncomingMulticastActionTypes:
                    cm.allowedIncomingMulticastActionTypes
            }
        );
    }
    if (cm.options.saga && is.func(cm.options.saga)) {
        this.appContainer.sagaRegistry.register(
            cm.options.saga.bind(cm.componentInstance),
            {
                path: cm.fullPath,
                namespace: cm.namespace,
                allowedIncomingMulticastActionTypes:
                    cm.allowedIncomingMulticastActionTypes
            }
        );
    }
}

function deRegisterComponentManager(cm) {
    if (cm.options.reducer && is.func(cm.options.reducer)) {
        this.appContainer.sagaRegistry.deregister(cm.fullPath);
    }
    if (cm.options.saga && is.func(cm.options.saga)) {
        this.appContainer.reducerRegistry.deregister(cm.fullPath);
    }
    this.appContainer.namespaceRegistry.deregisterComponentManager(cm);
}

export default ComponentRegistry;
