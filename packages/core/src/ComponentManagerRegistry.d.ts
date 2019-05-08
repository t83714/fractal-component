import ComponentManager, {
    ManageableComponent,
    ManageableComponentOptions
} from "./ComponentManager";
import AppContainer from "./AppContainer";

declare class ComponentManagerRegistry {
    constructor(appContainer: AppContainer);
    appContainer: AppContainer;
    register(manager: ComponentManager): void;
    deregister(manager: ComponentManager): void;
    getComponentAutoIdCount(...pathItems: string[]): number;
    releaseComponentAutoIdCount(
        idCount: number,
        ...pathItems: string[]
    ): number;
    destroy(): void;
}

export default ComponentManagerRegistry;
