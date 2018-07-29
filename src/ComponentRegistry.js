import PathRegistry from "./PathRegistry";
import ComponentManager from "./ComponentManager";

const defaultOptions = {
    isServerSideRendering: false
};

class ComponentRegistry {
    constructor(options = {}) {
        this.options = { ...defaultOptions, ...options };
        this.pathRegistry = new PathRegistry();
    }

    register(componentInstance, options = {}) {
        const runTimeOptions = { ...this.options, ...options };
        const manager = new ComponentManager(componentInstance, runTimeOptions);
        console.log(manager);
    }
}

export default ComponentRegistry;
