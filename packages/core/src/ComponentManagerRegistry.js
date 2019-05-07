import PathRegistry from "./PathRegistry";
import { is } from "./utils";

class ComponentManagerRegistry {
    constructor(appContainer) {
        this.appContainer = appContainer;
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

    register(manager) {
        if (this.componentManagerStore[manager.fullPath]) {
            throw new Error(
                `Try to register component to an existing path: ${
                    manager.fullPath
                }`
            );
        }
        this.componentManagerStore[manager.fullPath] = manager;
        this.appContainer.namespaceRegistry.registerComponentManager(manager);

        if (manager.options.reducer && is.func(manager.options.reducer)) {
            this.appContainer.reducerRegistry.register(
                manager.options.reducer.bind(manager.componentInstance),
                {
                    initState: manager.initState,
                    path: manager.fullPath,
                    namespace: manager.namespace,
                    persistState: manager.persistState,
                    allowedIncomingMulticastActionTypes:
                        manager.allowedIncomingMulticastActionTypes
                }
            );
        }
        if (manager.options.saga && is.func(manager.options.saga)) {
            this.appContainer.sagaRegistry.register(
                manager.options.saga.bind(manager.componentInstance),
                {
                    path: manager.fullPath,
                    namespace: manager.namespace,
                    sharedStates: manager.sharedStates,
                    allowedIncomingMulticastActionTypes:
                        manager.allowedIncomingMulticastActionTypes
                }
            );
        }
    }

    deregister(manager) {
        if (manager.options.reducer && is.func(manager.options.reducer)) {
            this.appContainer.reducerRegistry.deregister(manager.fullPath);
        }
        if (manager.options.saga && is.func(manager.options.saga)) {
            this.appContainer.sagaRegistry.deregister(manager.fullPath);
        }
        this.appContainer.namespaceRegistry.deregisterComponentManager(manager);
    }

    retrieveComponentManager(componentInstance) {
        return Object.keys(this.componentManagerStore)
            .map(path => this.componentManagerStore[path])
            .find(cm => cm.componentInstance === componentInstance);
    }

    destroy() {
        Object.values(this.componentManagerStore).map(cm => cm.destroy());
    }
}

export default ComponentManagerRegistry;
