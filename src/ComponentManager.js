import uniqid from "uniqid";
import PathRegistry, { normalize } from "./PathRegistry";

const defaultOptions = {
    saga: null,
    initState: {},
    namespace: null,
    namespacePrefix: null,
    componentId: null,
    persistState: false,
    isServerSideRendering: false
};

const noop = function() {};

class ComponentManager {
    constructor(componentInstance, options = {}) {
        this.options = { ...defaultOptions, ...options };
        this.managingInstance = componentInstance;
        this.displayName = getComponentName(this.managingInstance);
        this.isInitialized = false;

        const settleStringSettingFunc = settleStringSetting.bind(this);
        this.namespace = settleStringSettingFunc(
            this.options.namespace
        );
        if (this.namespace.indexOf("*") !== -1)
            throw new Error("`Namespace` cannot contain `*`.");
        this.isAutoComponentId = false;
        this.componentId = settleStringSettingFunc(
            this.options.componentId
        );
        if (
            this.componentId.indexOf("/") !== -1 ||
            this.componentId.indexOf("*") !== -1
        )
            throw new Error("`Component ID` cannot contain `/` or `*`.");
        if (!this.componentId) {
            this.isAutoComponentId = true;
            this.componentId = uniqid(`${this.componentDisplayName}-`);
        }
        this.namespacePrefix = settleStringSettingFunc(
            this.options.namespacePrefix
        );
        if (this.namespacePrefix.indexOf("*") !== -1)
            throw new Error("`namespacePrefix` cannot contain `*`.");
        this.fullNamespace = fullNamespace.bind(this)();
        this.fullNamespacePath = fullNamespacePath.bind(this)();

        if (this.options.isServerSideRendering) {
            this.init();
        } else {
            injectLifeHookers.apply(this);
        }
    }

    init() {
        if (this.isInitialized) return;

        console.log("init... component manager...");
        this.isInitialized = true;
    }

    destroy() {
        if (!this.isInitialized) return;
        this.isInitialized = false;
        console.log("destroy... component manager...");
    }
}

function injectLifeHookers() {
    const origComponentDidMount = this.managingInstance.componentDidMount
        ? this.managingInstance.componentDidMount
        : noop;
    const origComponentWillUnmount = this.managingInstance
        .componentWillUnmount
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

function fullNamespacePath() {
    const parts = [];
    if (this.fullNamespacePath) parts.push(this.fullNamespacePath);
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
