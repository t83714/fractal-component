import objectPath from "object-path";
import { PathContext, normalize } from "./PathRegistry";
import { noop, getPackageName, log, createClassNameGenerator, symbolToString } from "./utils";

const defaultOptions = {
    saga: null,
    initState: {},
    reducer: null,
    namespace: null,
    namespacePrefix: null,
    componentId: null,
    persistState: true,
    //--- when `allowedIncomingMulticastActionTypes` is string
    //--- only "*" is accepted (means accepting any actionTypes)
    allowedIncomingMulticastActionTypes: null,
    isServerSideRendering: false
};

const pkgName = getPackageName();

export const COMPONENT_MANAGER_LOCAL_KEY = Symbol(
    "COMPONENT_MANAGER_LOCAL_KEY"
);

class ComponentManager {
    constructor(componentInstance, options, appContainer) {
        this.createClassNameGenerator = createClassNameGenerator.bind(this);
        this.componentInstance = componentInstance;
        this.options = { ...defaultOptions, ...options };
        this.appContainer = appContainer;
        this.store = appContainer.store;

        this.isInitialized = false;
        this.isDestroyed = false;

        this.initCallback = noop;
        this.destroyCallback = noop;

        this.storeListener = bindStoreListener.bind(this);
        this.storeListenerUnsubscribe = null;

        this.managingInstance = componentInstance;
        this.displayName = getComponentName(this.managingInstance);

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
        this.componentId = normalize(
            settleStringSettingFunc(this.options.componentId)
        );
        if (
            this.componentId.indexOf("/") !== -1 ||
            this.componentId.indexOf("*") !== -1
        )
            throw new Error("`Component ID` cannot contain `/` or `*`.");
        if (!this.componentId) {
            this.isAutoComponentId = true;
            this.componentId = this.appContainer.componentRegistry.createComponentId(
                this.namespacePrefix,
                this.namespace
            );
        }
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

        this.isServerSideRendering = this.options.isServerSideRendering;
        this.persistState = this.options.persistState;
        this.fullNamespace = fullNamespace.bind(this)();
        this.fullPath = fullPath.bind(this)();
        this.fullLocalPath = fullLocalPath.bind(this)();
        this.allowedIncomingMulticastActionTypes = this.options.allowedIncomingMulticastActionTypes;

        determineInitState.apply(this);
    }

    enhanceComponentInstance(initCallback = null, destroyCallback = null) {
        if (initCallback) {
            this.initCallback = initCallback;
        }
        if (destroyCallback) {
            this.destroyCallback = destroyCallback;
        }
        //--- should NOT shallow copy to avoid unnecessary render
        this.componentInstance.state = this.initState;
        if (this.isServerSideRendering) {
            this.setState = noop;
        } else {
            this.setState = this.componentInstance.setState.bind(
                this.componentInstance
            );
        }

        this.componentInstance.setState = function() {
            throw new Error(
                `This component is managed by \`${pkgName}\`. You should dispatch action to mutate component state.`
            );
        };
        this.storeListenerUnsubscribe = this.store.subscribe(
            this.storeListener
        );
        this.componentInstance[COMPONENT_MANAGER_LOCAL_KEY] = this;
        if (this.isServerSideRendering) {
            this.init();
        } else {
            injectLifeHookers.apply(this);
        }
    }

    dispatch(action, relativeDispatchPath = "") {
        const pc = new PathContext(this.fullPath);
        const namespacedAction = pc.convertNamespacedAction(
            action,
            relativeDispatchPath
        );

        // --- query action Type's original namespace so that it can be serialised correctly if needed
        const namespace = this.appContainer.actionRegistry.findNamespaceByActionType(
            namespacedAction.type
        );
        if (!namespace) {
            log(
                `Cannot locate namespace for Action \`${symbolToString(namespacedAction.type)}\`: \`${symbolToString(namespacedAction.type)}\` needs to be registered otherwise the action won't be serializable.`
            );
        } else {
            namespacedAction.namespace = namespace;
        }

        return this.store.dispatch(namespacedAction);
    }

    init() {
        if (this.isInitialized || this.isDestroyed) return;
        this.initCallback(this);
        this.isInitialized = true;
    }

    getNamespaceData() {
        return this.appContainer.namespaceRegistry.getData(this.namespace);
    }

    destroy() {
        this.isDestroyed = true;
        if (!this.isInitialized) return;
        this.destroyCallback(this);
        if (this.storeListenerUnsubscribe) {
            this.storeListenerUnsubscribe();
            this.storeListenerUnsubscribe = null;
        }
        this.appContainer = null;
        this.store = null;
        this.isInitialized = false;
    }
}

function bindStoreListener() {
    const state = objectPath.get(
        this.store.getState(),
        this.fullPath.split("/")
    );
    if (state === this.componentInstance.state) return;
    this.setState(state);
}

function determineInitState() {
    let initState = this.managingInstance.state;
    if (!initState) {
        initState = this.options.initState;
    }
    if (!initState) {
        initState = {};
    }
    this.initState = { ...initState };
}

function injectLifeHookers() {
    const origComponentDidMount = this.managingInstance.componentDidMount
        ? this.managingInstance.componentDidMount
        : noop;
    const origComponentWillUnmount = this.managingInstance.componentWillUnmount
        ? this.managingInstance.componentWillUnmount
        : noop;
    this.managingInstance.componentDidMount = handlerComponentDidMount.bind(
        this,
        origComponentDidMount
    );
    this.managingInstance.componentWillUnmount = handlerComponentWillUnmount.bind(
        this,
        origComponentWillUnmount
    );
}

function handlerComponentDidMount(originalHandler) {
    this.init();
    if (originalHandler && typeof originalHandler === "function") {
        originalHandler.apply(this.managingInstance);
    }
}

function handlerComponentWillUnmount(originalHandler) {
    if (originalHandler && typeof originalHandler === "function") {
        originalHandler.apply(this.managingInstance);
    }
    this.destroy();
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
            const value = setting.bind(
                this,
                this.displayName,
                this.managingInstance
            )();
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
