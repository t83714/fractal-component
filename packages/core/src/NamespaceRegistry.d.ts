import ComponentManager from "./ComponentManager";
import SharedStateContrainer from "./SharedStateContainer";
import AppContainer from "./AppContainer";

declare class NamespaceRegistry {
    constructor(appContainer: AppContainer);
    registerComponentManager(
        cm: ComponentManager | SharedStateContrainer
    ): void;
    deregisterComponentManager(
        cm: ComponentManager | SharedStateContrainer
    ): void;
    getData(namespace: string): any;
    // iterate through all stored namespace data
    foreach(iteratee: (data: object, namespace: string) => void): void;
    map(iteratee: (data: object, namespace: string) => any): any[];
    destroy(): void;
}

export default NamespaceRegistry;
