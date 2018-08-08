import uniqid from "uniqid";
import objectPath from "object-path";
import { PathContext, normalize } from "./PathRegistry";
import { noop, getPackageName } from "./utils";

const defaultOptions = {
    saga: null,
    initState: {},
    reducer: null,
    namespace: null,
    namespacePrefix: null,
    componentId: null,
    persistState: false,
    isServerSideRendering: false
};

const pkgName = getPackageName();

export const COMPONENT_MANAGER_LOCAL_KEY = Symbol("COMPONENT_MANAGER_LOCAL_KEY");

class ComponentManager {
    constructor(componentInstance, options, store) {
        this.componentInstance = componentInstance;
        this.options = { ...defaultOptions, ...options };
        this.store = store;

        this.isInitialized = false;
        this.isDestroyed = false;

        this.initCallback = noop;
        this.destroyCallback = noop;

        this.storeListener = bindStoreListener.bind(this);
        this.storeListenerUnsubscribe = null;

        this.managingInstance = componentInstance;
        this.displayName = getComponentName(this.managingInstance);

        if (!this.options.reducer) {
            throw new Error(
                `Failed to initialise \`${
                    this.displayName
                }\`: a reducer function is required.`
            );
        }

        const settleStringSettingFunc = settleStringSetting.bind(this);
        this.namespace = normalize(
            settleStringSettingFunc(this.options.namespace)
        );
        if (this.namespace.indexOf("*") !== -1)
            throw new Error("`Namespace` cannot contain `*`.");
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
            this.componentId = uniqid(`${this.displayName}-`);
        }
        if(this.componentInstance.props.namespacePrefix) {
            this.namespacePrefix = normalize(
                settleStringSettingFunc(this.componentInstance.props.namespacePrefix)
            );
        }
        if(!this.namespacePrefix){
            this.namespacePrefix = normalize(
                settleStringSettingFunc(this.options.namespacePrefix)
            );
        }
        if (this.namespacePrefix.indexOf("*") !== -1)
            throw new Error("`namespacePrefix` cannot contain `*`.");
        this.fullNamespace = fullNamespace.bind(this)();
        this.fullPath = fullPath.bind(this)();

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
        this.setState = this.componentInstance.setState.bind(
            this.componentInstance
        );
        this.componentInstance.setState = function() {
            throw new Error(
                `This component is managed by \`${pkgName}\`. You should dispatch action to mutate component state.`
            );
        };
        this.storeListenerUnsubscribe = this.store.subscribe(
            this.storeListener
        );
        this.componentInstance[COMPONENT_MANAGER_LOCAL_KEY] = this;
        if (this.options.isServerSideRendering) {
            this.init();
        } else {
            injectLifeHookers.apply(this);
        }
    }

    dispatch(action, relativeDispatchPath = "") {
        const pc = new PathContext(this.fullPath);
        const unnamespacedAction = pc.convertNamespacedAction(
            action,
            relativeDispatchPath
        );
        return this.store.dispatch(unnamespacedAction);
    }

    init() {
        if (this.isInitialized || this.isDestroyed) return;
        this.initCallback(this);
        this.isInitialized = true;
    }

    destroy() {
        this.isDestroyed = true;
        if (!this.isInitialized) return;
        this.destroyCallback(this);
        if (this.storeListenerUnsubscribe) {
            this.storeListenerUnsubscribe();
            this.storeListenerUnsubscribe = null;
        }
        this.isInitialized = false;
    }
}

function bindStoreListener() {
    const state = objectPath.get(this.store.getState(), this.fullPath.split("/"));
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

function getComponentName(componentInstance) {
    try {
        return (
            componentInstance.constructor.displayName ||
            componentInstance.constructor.name ||
            "Component"
        );
    } catch (e) {
        return `Compon`;
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
            console.log(
                `Failed to retrieve setting via executing generating function: ${e.getMessage()}`
            );
            return "";
        }
    } else {
        return String(setting);
    }
}

export default ComponentManager;
