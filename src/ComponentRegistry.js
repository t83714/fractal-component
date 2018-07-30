import PathRegistry from "./PathRegistry";
import ComponentManager, { CONTAINER_LOCAL_KEY } from "./ComponentManager";

const defaultOptions = {
    isServerSideRendering: false
};

class ComponentRegistry {
    constructor(options = {}) {
        this.options = { ...defaultOptions, ...options };
        this.pathRegistry = new PathRegistry();
        this.componentManagerStore = {};
    }

    register(componentInstance, options) {
        const runTimeOptions = { ...this.options, ...options };
        const manager = new ComponentManager(componentInstance, runTimeOptions);
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
        const cm = componentInstance[CONTAINER_LOCAL_KEY];
        if (!cm) return;
        deRegisterComponentManager.call(this, cm);
    }
}

function registerComponentManager(cm) {
    this.pathRegistry;
}

function deRegisterComponentManager(cm) {}

export default ComponentRegistry;
