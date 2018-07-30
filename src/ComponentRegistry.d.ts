import {
    ManageableComponent,
    ManageableComponentOptions
} from "./ComponentManager";
import ComponentManager from "./ComponentManager";

declare class ComponentRegistry {
    constructor();
    registerComponent(
        componentInstance: ManageableComponent,
        options?: ManageableComponentOptions
    ): void;
}

export default ComponentRegistry;
