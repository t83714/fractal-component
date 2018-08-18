import AppContainer, { AppContainerOptions } from "./AppContainer";
import {
    ManageableComponent,
    ManageableComponentOptions
} from "./ComponentManager";
import { SagaOptions } from "./SagaRegistry";
import { ReducerOptions } from "./ReducerRegistry";
import { Reducer, Action } from "redux";
import { Task } from "redux-saga";

export declare function createAppContainer(
    options: AppContainerOptions
): AppContainer;
export declare function getAppContainer(): AppContainer;
export declare function registerComponent(
    componentInstance: ManageableComponent,
    options: ManageableComponentOptions
): void;
export declare function deregisterComponent(
    componentInstance: ManageableComponent
): void;
export declare function registerSaga(
    saga: GeneratorFunction,
    sagaOptions: SagaOptions
): void;
export declare function deregisterSaga(pathOrTask: string | Task): void;
export declare function registerReducer(
    reducer: Reducer,
    reducerOptions: ReducerOptions
): void;
export declare function deregisterReducer(path: string): void;
export declare function registerActions(
    namespace: string,
    actions: symbol | symbol[] | object
): void;
export declare function serialiseAction(action: Action): string;
export declare function deserialiseAction(actionJson: string): Action;
export declare function destroyAppContainer(): void;
