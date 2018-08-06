import AppContainer, { AppContainerOption } from "./AppContainer";
import {
    ManageableComponent,
    ManageableComponentOptions
} from "./ComponentManager";

export declare function createAppContainer(
    options: AppContainerOption
): AppContainer;
export declare function getCurrentAppContainerToken(): Symbol;
export declare function getAppContainer(): AppContainer;
export declare function registerComponent(
    componentInstance: ManageableComponent,
    options: ManageableComponentOptions
): void;
export declare function destroyAppContainer(): void;
