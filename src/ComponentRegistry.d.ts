import {
    ManageableComponent,
    ManageableComponentOptions
} from "./ComponentManager";

declare class ComponentRegistry {
    constructor();
    registerComponent(
        componentInstance: ManageableComponent,
        options: ManageableComponentOptions
    ): void;
}

export default ComponentRegistry;
