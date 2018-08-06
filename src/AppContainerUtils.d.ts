import AppContainer, { AppContainerOptions } from "./AppContainer";
import {
    ManageableComponent,
    ManageableComponentOptions
} from "./ComponentManager";

export declare function createAppContainer(
    options: AppContainerOptions
): AppContainer;
export declare function getCurrentAppContainerToken(): Symbol;
export declare function getAppContainer(): AppContainer;
export declare function registerComponent(
    componentInstance: ManageableComponent,
    options: ManageableComponentOptions
): void;
export declare function destroyAppContainer(): void;
