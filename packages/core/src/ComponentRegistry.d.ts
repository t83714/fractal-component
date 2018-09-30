import {
    ManageableComponent,
    ManageableComponentOptions
} from "./ComponentManager";
import ComponentManager from "./ComponentManager";
import AppContainer from "./AppContainer";

declare class ComponentRegistry {
    constructor(appContainer: AppContainer, options: ComponentRegistryOptions);
    appContainer: AppContainer;
    register(
        componentInstance: ManageableComponent,
        options?: ManageableComponentOptions
    ): ComponentManager;
    deregister(componentInstance: ManageableComponent): void;
    createComponentId(...pathItems: string[]): string;
    destroy(): void;
}

export default ComponentRegistry;

export interface ComponentRegistryOptions {
    isServerSideRendering?: boolean;
}
