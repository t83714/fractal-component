import PathRegistry from "./PathRegistry";
import { is } from "./utils";

export default class NamespaceRegistry {
    constructor(appContainer) {
        this.appContainer = appContainer;
        this.pathRegistry = new PathRegistry();
    }

    destroy(){
        this.pathRegistry.destroy();
        this.appContainer = null;
    }

    registerComponentManager(cm) {
        const { namespace, options } = cm;
        const {
            namespaceInitCallback,
            namespaceDestroyCallback,
            actionTypes
        } = options;
        if (this.pathRegistry.exist(namespace)) {
            const { cmList } = this.pathRegistry.getPathData(namespace);
            cmList.push(cm);
        } else {
            if (actionTypes) {
                this.appContainer.actionRegistry.register(
                    namespace,
                    actionTypes
                );
            }
            this.pathRegistry.add(namespace, {
                cmList: [cm],
                namespaceData: is.func(namespaceInitCallback)
                    ? namespaceInitCallback()
                    : {},
                namespaceInitCallback,
                namespaceDestroyCallback,
                actionTypes
            });
        }
    }

    deregisterComponentManager(cm) {
        const { namespace } = cm;
        let {
            cmList,
            namespaceDestroyCallback,
            namespaceData
        } = this.pathRegistry.getPathData(namespace);
        cmList = cmList.filter(item => item !== cm);
        if (!cmList.length) {
            this.pathRegistry.remove(namespace);
            this.appContainer.actionRegistry.deregister(namespace);
            if (is.func(namespaceDestroyCallback)) {
                namespaceDestroyCallback(namespaceData);
            }
        }
    }

    getData(namespace){
        const { namespaceData } = this.pathRegistry.getPathData(namespace);
        return namespaceData;
    }

    foreach(iteratee) {
        this.pathRegistry.foreach(({ namespaceData }, namespace) =>
            iteratee(namespaceData, namespace)
        );
    }

    map(iteratee) {
        this.pathRegistry.map(({ namespaceData }, namespace) =>
            iteratee(namespaceData, namespace)
        );
    }
}
