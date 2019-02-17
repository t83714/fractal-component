import {
    ManageableComponent,
    ManageableComponentOptions
} from "./ComponentManager";
import ComponentManager from "./ComponentManager";
import AppContainer from "./AppContainer";

declare class ComponentManagerRegistry {
    constructor(appContainer: AppContainer);
    appContainer: AppContainer;
    register(manager: ComponentManager): void;
    deregister(manager: ComponentManager): void;
    createComponentId(...pathItems: string[]): string;
    destroy(): void;
}

export default ComponentManagerRegistry;
