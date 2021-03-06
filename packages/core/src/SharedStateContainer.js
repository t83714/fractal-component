import { is } from "./utils";
import PathRegistry from "./PathRegistry";

export const defaultOptions = {
    initState: {},
    reducer: null,
    actionTypes: {},
    namespace: "",
    forceOverwriteInitialState: false,
    cleanStateDuringDestroy: true
};

class SharedStateContainer {
    constructor(options) {
        this.options = { ...defaultOptions, ...options };
        const { namespace, initState, actionTypes, reducer } = this.options;
        if (!is.string(namespace) || namespace.trim() === "") {
            throw new Error(
                "Shared State Container Namespace cannot be empty!"
            );
        }
        if (!reducer || !is.func(reducer)) {
            throw new Error("Shared State Container reducer cannot be empty!");
        }
        this.options = options;
        this.actionTypes = actionTypes
            ? is.array(actionTypes)
                ? actionTypes
                : Object.keys(actionTypes).map(key => actionTypes[key])
            : [];
        this.namespace = namespace;
        this.appContainer = null;
        this.initState = initState;
        this.isInitialized = false;
        this.fullPath = `@SharedState/${namespace}/c0`;
        this.pathRegistry = new PathRegistry();
    }

    getStoreState() {
        if (!this.appContainer) return this.initState;
        return this.appContainer.store.getState()[this.fullPath];
    }

    registerConsumer(componentManager) {
        componentManager.on("init", appContainer => {
            this.pathRegistry.add(componentManager.fullPath);
            init.call(this, appContainer);
        });
    }

    deregisterConsumer(componentManager) {
        const { fullPath } = componentManager;
        this.pathRegistry.remove(fullPath);
        if (!this.pathRegistry.isEmpty()) return;
        this.destroy();
    }

    supportActionType(actionType) {
        return this.actionTypes.indexOf(actionType) !== -1;
    }

    supportAction(action) {
        return this.supportActionType(action.type);
    }

    destroy() {
        if (!this.isInitialized) return;
        if (this.appContainer && this.appContainer.namespaceRegistry) {
            this.appContainer.namespaceRegistry.deregisterComponentManager(
                this
            );
        }
        if (
            this.appContainer &&
            this.appContainer.reducerRegistry &&
            this.options.reducer &&
            is.func(this.options.reducer)
        ) {
            this.appContainer.reducerRegistry.deregister(this.fullPath);
        }
        this.pathRegistry.destroy();
        this.appContainer = null;
        this.isInitialized = false;
    }
}

function init(appContainer) {
    if (this.isInitialized) return;
    this.isInitialized = true;
    this.appContainer = appContainer;
    appContainer.namespaceRegistry.registerComponentManager(this);
    if (this.options.reducer && is.func(this.options.reducer)) {
        appContainer.reducerRegistry.register(this.options.reducer.bind(this), {
            initState: this.initState,
            path: this.fullPath,
            namespace: this.namespace,
            allowedIncomingMulticastActionTypes: null
        });
    }
}

export default SharedStateContainer;
