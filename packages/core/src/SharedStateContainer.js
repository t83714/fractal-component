import objectPath from "object-path";
import { is } from "./utils";

export const defaultOptions = {
    initState: {},
    reducer: null,
    actionTypes: {},
    namespace: "",
    persistState: true
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
        this.actionTypes = actionTypes;
        this.namespace = namespace;
        this.reducer = reducer;
        this.appContainer = null;
        this.state = initState;
        this.cachedState = initState;
        this.isInitialized = false;
        this.fullPath = `@SharedState/${namespace}/c0`;
        this.componentListeners = {};
        this.storeListenerUnsubscribe = null;
    }

    getState() {
        return this.state;
    }

    registerConsumer(localKey, componentManager) {
        this.componentListeners[componentManager.fullPath] = state => {
            componentManager.emit("sharedStateChanged", {
                localKey,
                state
            });
        };
        componentManager.on("init", appContainer => {
            init.bind(this)(appContainer);
        });
    }

    deregisterConsumer(componentManager) {
        const { fullPath } = componentManager;
        delete this.componentListeners[fullPath];
        if (Object.keys(this.componentListeners).length) return;
        this.destroy();
    }

    destroy() {
        if (!this.isInitialized) return;
        unsubscribeStoreListener.apply(this);
        if (this.appContainer && this.appContainer.namespaceRegistry) {
            this.appContainer.namespaceRegistry.deregisterComponentManager(
                this
            );
        }
        if (
            this.appContainer &&
            this.appContainer.reducerRegistry &&
            this.reducer &&
            is.func(this.reducer)
        ) {
            this.appContainer.reducerRegistry.deregister(this.fullPath);
        }
        this.componentListeners = {};
        this.appContainer = null;
        this.isInitialized = false;
        this.state = this.options.initState;
        this.cachedState = this.options.initState;
    }
}

function init(appContainer) {
    if (this.isInitialized) return;
    this.isInitialized = true;
    this.appContainer = appContainer;
    this.storeListenerUnsubscribe = appContainer.store.subscribe(() => {
        const state = objectPath.get(
            appContainer.store.getState(),
            this.fullPath.split("/")
        );
        if (state === this.cachedState) return;
        this.cachedState = state;
        this.state = state;
        Object.values(this.componentListeners).forEach(handler =>
            handler(state)
        );
    });
    appContainer.namespaceRegistry.registerComponentManager(this);
    if (this.options.reducer && is.func(this.options.reducer)) {
        appContainer.reducerRegistry.register(this.reducer.bind(this), {
            initState: this.options.initState,
            path: this.fullPath,
            namespace: this.namespace,
            allowedIncomingMulticastActionTypes: Object.values(this.actionTypes)
        });
    }
}

function unsubscribeStoreListener() {
    if (this.storeListenerUnsubscribe) {
        this.storeListenerUnsubscribe();
        this.storeListenerUnsubscribe = null;
    }
}

export default SharedStateContainer;
