import { is, objectValues } from "./utils";

class ComponentManagerRegistry {
    constructor(appContainer) {
        this.appContainer = appContainer;
        this.componentManagerStore = {};
        this.componentAutoIdCounter = {};
    }

    getComponentAutoIdCount(...pathItems) {
        const path = pathItems.filter(item => (item ? true : false)).join("/");
        if (!is.array(this.componentAutoIdCounter[path])) {
            this.componentAutoIdCounter[path] = [];
        }
        if (!this.componentAutoIdCounter[path].length) {
            this.componentAutoIdCounter[path].push(0);
            return 0;
        }
        const lastCount = this.componentAutoIdCounter[path][
            this.componentAutoIdCounter[path].length - 1
        ];
        const count = lastCount + 1;
        this.componentAutoIdCounter[path].push(count);
        return count;
    }

    releaseComponentAutoIdCount(idCount, ...pathItems) {
        const path = pathItems.filter(item => (item ? true : false)).join("/");
        if (
            !is.array(this.componentAutoIdCounter[path]) ||
            !this.componentAutoIdCounter[path].length
        ) {
            return;
        }
        this.componentAutoIdCounter[path] = this.componentAutoIdCounter[
            path
        ].filter(c => c !== idCount);
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
                    forceOverwriteInitialState:
                        manager.options.forceOverwriteInitialState,
                    cleanStateDuringDestroy:
                        manager.options.cleanStateDuringDestroy,
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
        delete this.componentManagerStore[manager.fullPath];
        if (manager.options.reducer && is.func(manager.options.reducer)) {
            this.appContainer.reducerRegistry.deregister(manager.fullPath);
        }
        if (manager.options.saga && is.func(manager.options.saga)) {
            this.appContainer.sagaRegistry.deregister(manager.fullPath);
        }
        this.appContainer.namespaceRegistry.deregisterComponentManager(manager);
        // --- release manager auto id count
        if (manager.isAutoComponentId) {
            this.releaseComponentAutoIdCount(
                manager.autoIdCount,
                manager.namespacePrefix,
                manager.namespace
            );
        }
    }

    retrieveComponentManager(componentInstance) {
        return Object.keys(this.componentManagerStore)
            .map(path => this.componentManagerStore[path])
            .find(cm => cm.componentInstance === componentInstance);
    }

    destroy() {
        objectValues(this.componentManagerStore).map(cm => cm.destroy());
        this.componentManagerStore = {};
        this.componentAutoIdCounter = {};
    }
}

export default ComponentManagerRegistry;
