import {
    ManageableComponent,
    ManageableComponentOptions
} from "./ComponentManager";
import ComponentManager from "./ComponentManager";

declare class ComponentRegistry {
    constructor();
    register(
        componentInstance: ManageableComponent,
        options?: ManageableComponentOptions
    ): ComponentManager;
    deregister(componentInstance: ManageableComponent):void;
}

export default ComponentRegistry;
