import AppContainer, { AppContainerOption } from "./AppContainer";
import { RegistrableComponent } from "./ComponentRegistry";

export declare const APP_CONATINER_KEY: Symbol;
export declare const CONTAINER_LOCAL_KEY: Symbol;
export declare function createAppContainer(
    options: AppContainerOption
): AppContainer;
export declare function getCurrentAppContainerToken(): Symbol;
export declare function getAppContainer(): AppContainer;
export declare function registryComponent(
    componentInstance: RegistrableComponent
): void;
export declare function destroyAppContainer(ref: Symbol | AppContainer): void;
