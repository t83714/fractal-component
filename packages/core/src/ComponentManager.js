import objectPath from "object-path";
import mitt from "mitt";
import { COMPONENT_MANAGER_ACCESS_KEY } from "./symbols";
import { getAppContainer } from "./AppContainerUtils";
import { PathContext, normalize } from "./PathRegistry";
import {
    noop,
    getPackageName,
    log,
    createClassNameGenerator,
    symbolToString,
    shallowCopy
} from "./utils";
import * as is from "./utils/is";

export const defaultOptions = {
    saga: null,
    initState: {},
    reducer: null,
    name: "Component",
    namespace: null,
    namespacePrefix: null,
    componentId: null,
    forceOverwriteInitialState: false,
    cleanStateDuringDestroy: true,
    //--- when `allowedIncomingMulticastActionTypes` is string
    //--- only "*" is accepted (means accepting any actionTypes)
    allowedIncomingMulticastActionTypes: null,
    sharedStates: {}
};

const pkgName = getPackageName();

const initialisationErrorMsg =
    "Component Manager is not initialized yet.\n" +
    "It will be initialized just before first render() call to support new React context API since 16.3.0.";

class ComponentManager {
    constructor(componentInstance, options, appContainer = null) {
        if (!componentInstance) {
            throw new Error("componentInstance can't be empty!");
        }

        if (is.managedComponentInstance(componentInstance)) {
            throw new Error(
                "Unable to create a ComponentManager for a component instance that is managed already."
            );
        }

        componentInstance[COMPONENT_MANAGER_ACCESS_KEY] = this;

        this.all = Object.create(null);
        this.emitter = mitt(this.all);

        this.createClassNameGenerator = createClassNameGenerator.bind(this);
        this.componentInstance = componentInstance;

        this.options = { ...defaultOptions, ...options };
        this.options.forceOverwriteInitialState = this.options
            .forceOverwriteInitialState
            ? true
            : false;
        this.options.cleanStateDuringDestroy = this.options
            .cleanStateDuringDestroy
            ? true
            : false;

        this.appContainer = null;
        this.store = null;
        this.receivedStateUpdateFromStore = false;
        this.initState = this.options.initState;
        // --- save a referece to component state only
        // --- in order to determine whether the state is required to sync
        // --- as React's setState will always save a copy
        this.cachedState = null;
        this.sharedStates = this.options.sharedStates
            ? Object.keys(this.options.sharedStates).map(localKey => ({
                  localKey,
                  container: this.options.sharedStates[localKey]
              }))
            : [];
        this.cachedSharedState = {};

        this.isInitialized = false;
        this.isDestroyed = false;

        this.storeListener = bindStoreListener.bind(this);
        this.storeListenerUnsubscribe = null;

        this.displayName = getComponentName(this.componentInstance);

        const settleStringSettingFunc = settleStringSetting.bind(this);

        if (!this.namespacePrefix) {
            this.namespacePrefix = normalize(
                settleStringSettingFunc(this.options.namespacePrefix)
            );
        }
        if (this.namespacePrefix.indexOf("*") !== -1)
            throw new Error("`namespacePrefix` cannot contain `*`.");

        this.namespace = normalize(
            settleStringSettingFunc(this.options.namespace)
        );
        if (this.namespace.indexOf("*") !== -1)
            throw new Error("`Namespace` cannot contain `*`.");
        if (!this.namespace)
            throw new Error(
                "Missing Component `namespace`: Component `namespace` must be specified."
            );

        this.isAutoComponentId = false;
        this.autoIdCount = 0;
        this.componentId = normalize(
            settleStringSettingFunc(this.options.componentId)
        );
        if (
            this.componentId.indexOf("/") !== -1 ||
            this.componentId.indexOf("*") !== -1
        )
            throw new Error("`Component ID` cannot contain `/` or `*`.");

        if (
            this.componentInstance.props &&
            this.componentInstance.props.namespacePrefix
        ) {
            this.namespacePrefix = normalize(
                settleStringSettingFunc(
                    this.componentInstance.props.namespacePrefix
                )
            );
        }

        this.fullNamespace = fullNamespace.apply(this);
        this.allowedIncomingMulticastActionTypes = this.options.allowedIncomingMulticastActionTypes;

        // --- take over component's setState method
        this.setState = this.componentInstance.setState.bind(
            this.componentInstance
        );
        this.componentInstance.setState = () => {
            throw new Error(
                `This component is managed by \`${pkgName}\`. You should dispatch action to mutate component state.`
            );
        };

        this.getAppContainer = () => {
            if (is.appContainer(appContainer)) return appContainer;
            else return getAppContainer(this.componentInstance);
        };

        this.on("init", appContainer => {
            // --- we should establish component Id as early as possible
            if (!this.componentId) {
                this.isAutoComponentId = true;
                this.autoIdCount = appContainer.componentManagerRegistry.getComponentAutoIdCount(
                    this.namespacePrefix,
                    this.namespace
                );
                this.componentId = "c" + this.autoIdCount;
            }

            this.fullPath = fullPath.apply(this);
            this.fullLocalPath = fullLocalPath.apply(this);
        });

        setComponentInitState.apply(this);
        injectLifeHookers.apply(this);

        this.on("init", appContainer => {
            this.appContainer = appContainer;
            this.store = appContainer.store;

            // --- still not ready to setState but will set `receivedStateUpdateFromStore`
            // --- to decide if an initial update is required
            this.storeListenerUnsubscribe = this.store.subscribe(() => {
                this.receivedStateUpdateFromStore = true;
            });

            appContainer.componentManagerRegistry.register(this);

            if (!this.isInitialized && !this.isDestroyed) {
                this.isInitialized = true;
            }

            this.emitter.emit("initd");
        });

        this.on("mount", () => {
            unsubscribeStoreListener.apply(this);
            // --- Attach start listener & resync component state
            this.storeListenerUnsubscribe = this.store.subscribe(
                this.storeListener
            );

            if (this.receivedStateUpdateFromStore) {
                this.storeListener();
            }
        });

        this.on("destroy", () => {
            this.destroy();
        });

        this.dispatch = this.dispatch.bind(this);
    }

    on(type, handler) {
        this.emitter.on(type, handler);
    }

    off(type) {
        if (typeof type === "undefined") {
            this.all = Object.create(null);
        }
        delete this.all[type];
    }

    emit(type, evt) {
        this.emitter.emit(type, evt);
    }

    dispatch(action, relativeDispatchPath = "") {
        if (!this.isInitialized) {
            throw new Error(initialisationErrorMsg);
        }

        const pc = new PathContext(this.fullPath);
        let isAbsolutePath = false;

        if (relativeDispatchPath === "") {
            const idx = this.getSharedStateIndexByActionType(action.type);
            if (idx !== -1) {
                // --- send shared states related actions to shared states container directly
                isAbsolutePath = true;
                relativeDispatchPath = this.sharedStates[idx].container
                    .fullPath;
            }
        }

        const namespacedAction = pc.convertNamespacedAction(
            action,
            relativeDispatchPath,
            isAbsolutePath
        );

        // --- query action Type's original namespace so that it can be serialised correctly if needed
        const namespace = this.appContainer.actionRegistry.findNamespaceByActionType(
            namespacedAction.type
        );
        if (!namespace) {
            log(
                `Cannot locate namespace for Action \`${symbolToString(
                    namespacedAction.type
                )}\`: \`${symbolToString(
                    namespacedAction.type
                )}\` needs to be registered otherwise the action won't be serializable.`
            );
        } else {
            namespacedAction.namespace = namespace;
        }

        return this.store.dispatch(namespacedAction);
    }

    getNamespaceData() {
        if (!this.isInitialized) {
            throw new Error(initialisationErrorMsg);
        }
        return this.appContainer.namespaceRegistry.getData(this.namespace);
    }

    isSharedStateAction(action) {
        for (let i = 0; i < this.sharedStates.length; i++) {
            if (this.sharedStates[i].container.supportAction(action) === true)
                return true;
        }
        return false;
    }

    getSharedStateIndexByActionType(actionType) {
        for (let i = 0; i < this.sharedStates.length; i++) {
            if (
                this.sharedStates[i].container.supportActionType(actionType) ===
                true
            )
                return i;
        }
        return -1;
    }

    destroy() {
        this.isDestroyed = true;
        if (!this.isInitialized) return;
        this.off();
        unsubscribeStoreListener.apply(this);
        if (this.appContainer && this.appContainer.componentManagerRegistry) {
            this.appContainer.componentManagerRegistry.deregister(this);
        }
        this.appContainer = null;
        this.store = null;
        this.isInitialized = false;
        this.setState = null;
        this.cachedState = null;
        this.cachedSharedState = {};
        this.componentInstance[COMPONENT_MANAGER_ACCESS_KEY] = null;
        this.componentInstance = null;
        this.sharedStates.forEach(({ container }) =>
            container.deregisterConsumer(this)
        );
    }
}

ComponentManager.getManager = componentInstance => {
    return componentInstance[COMPONENT_MANAGER_ACCESS_KEY];
};

function unsubscribeStoreListener() {
    if (this.storeListenerUnsubscribe) {
        this.storeListenerUnsubscribe();
        this.storeListenerUnsubscribe = null;
    }
}

function bindStoreListener() {
    let requireUpdate = false;

    let state = this.store.getState()[this.fullPath];
    /**
     * When a component is created without a reducer, the state will be `undefined`.
     * We need to set it to `{}` in case any Shared States are available
     */
    if (is.undef(state)) {
        state = {};
    } else {
        if (state !== this.cachedState) {
            requireUpdate = true;
        }
    }

    if (!requireUpdate && !this.sharedStates.length) return;

    const newState = shallowCopy(state);
    const cachedSharedStateUpdateList = [];
    this.sharedStates.forEach(({ localKey, container }) => {
        const sharedState = container.getStoreState();
        objectPath.set(newState, localKey, sharedState);
        if (this.cachedSharedState[localKey] !== sharedState) {
            requireUpdate = true;
            cachedSharedStateUpdateList.push({
                localKey,
                sharedState
            });
        }
    });

    if (!requireUpdate) return;

    // --- no state update before `isInitialized`
    // --- once `isInitialized`,
    // --- check this field to decide whether an initial this.setState call is needed
    this.receivedStateUpdateFromStore = true;
    if (this.isInitialized) {
        this.cachedState = state;
        cachedSharedStateUpdateList.forEach(({ localKey, sharedState }) => {
            this.cachedSharedState[localKey] = sharedState;
        });
        this.setState(newState);
    }
}

function setComponentInitState() {
    let initState = this.componentInstance.state;
    if (!initState) {
        initState = this.options.initState;
    }
    if (!initState) {
        initState = {};
    }
    this.initState = shallowCopy(initState);
    this.componentInstance.state = shallowCopy(initState);
    this.cachedState = this.initState;

    processSharedStates.apply(this);
}

function processSharedStates() {
    if (!is.array(this.sharedStates) || !this.sharedStates.length) return;
    this.sharedStates.forEach(({ localKey, container }) => {
        container.registerConsumer(this);

        objectPath.set(
            this.componentInstance.state,
            localKey,
            container.initState
        );

        this.cachedSharedState[localKey] = container.initState;
    });
}

function injectLifeHookers() {
    const originalRender = this.componentInstance.render
        ? this.componentInstance.render
        : noop;
    const originalComponentDidMount = this.componentInstance.componentDidMount
        ? this.componentInstance.componentDidMount
        : noop;
    const originalComponentWillUnmount = this.componentInstance
        .componentWillUnmount
        ? this.componentInstance.componentWillUnmount
        : noop;

    const componentManagerEmitter = this.emitter;
    this.componentInstance.render = () => {
        this.componentInstance.render = originalRender;
        componentManagerEmitter.emit("init", this.getAppContainer());
        return originalRender.apply(this.componentInstance);
    };
    this.componentInstance.componentDidMount = () => {
        this.componentInstance.componentDidMount = originalComponentDidMount;
        componentManagerEmitter.emit("mount");
        originalComponentDidMount.apply(this.componentInstance);
    };
    this.componentInstance.componentWillUnmount = () => {
        this.componentInstance.componentWillUnmount = originalComponentWillUnmount;
        originalComponentWillUnmount.apply(this.componentInstance);
        componentManagerEmitter.emit("destroy");
    };
}

function fullNamespace() {
    const parts = [];
    if (this.namespacePrefix) parts.push(this.namespacePrefix);
    if (this.namespace) parts.push(this.namespace);
    return parts.join("/");
}

function fullPath() {
    const parts = [];
    if (this.fullNamespace) parts.push(this.fullNamespace);
    parts.push(this.componentId);
    return parts.join("/");
}

function fullLocalPath() {
    const parts = [];
    if (this.namespace) parts.push(this.namespace);
    parts.push(this.componentId);
    return parts.join("/");
}

function getComponentName(componentInstance) {
    try {
        return (
            componentInstance.constructor.displayName ||
            componentInstance.constructor.name ||
            this.options.name ||
            "Component"
        );
    } catch (e) {
        return `Component`;
    }
}

function settleStringSetting(setting) {
    if (!setting) return "";
    if (typeof setting === "function") {
        try {
            const value = setting.call(
                this,
                this.displayName,
                this.componentInstance
            );
            if (!value) return "";
            return value;
        } catch (e) {
            log(
                `Failed to retrieve setting via executing generating function: ${e.getMessage()}`,
                "error",
                e
            );
            return "";
        }
    } else {
        return String(setting);
    }
}

export default ComponentManager;
