import ComponentManager from "./ComponentManager";
import AppContainer from "./AppContainer";

declare class NamespaceRegistry {
    constructor(appContainer: AppContainer);
    registerComponentManager(cm: ComponentManager): void;
    deregisterComponentManager(cm: ComponentManager): void;
    getData(namespace: string): any;
    //--- iterate through all stored namespace data
    foreach(iteratee: (data: object, namespace: string) => void): void;
    map(iteratee: (data: object, namespace: string) => any): any[];
    destroy(): void;
}

export default NamespaceRegistry;
