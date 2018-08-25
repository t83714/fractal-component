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
export declare function getAppContainer(
    componentInstance?: ManageableComponent
): AppContainer;
export declare function registerComponent(
    componentInstance: ManageableComponent,
    options: ManageableComponentOptions
): void;
export declare function deregisterComponent(
    componentInstance: ManageableComponent
): void;
export declare function registerSaga(
    saga: GeneratorFunction,
    sagaOptions: SagaOptions,
    componentInstance?: ManageableComponent
): void;
export declare function deregisterSaga(
    pathOrTask: string | Task,
    componentInstance?: ManageableComponent
): void;
export declare function registerReducer(
    reducer: Reducer,
    reducerOptions: ReducerOptions,
    componentInstance?: ManageableComponent
): void;
export declare function deregisterReducer(
    path: string,
    componentInstance?: ManageableComponent
): void;
export declare function registerActions(
    namespace: string,
    actions: symbol | symbol[] | object,
    componentInstance?: ManageableComponent
): void;
export declare function serialiseAction(
    action: Action,
    componentInstance?: ManageableComponent
): string;
export declare function deserialiseAction(
    actionJson: string,
    componentInstance?: ManageableComponent
): Action;
export declare function findNamespaceByActionType(
    actionType: symbol,
    componentInstance?: ManageableComponent
): string;
export declare function destroyAppContainer(
    componentInstance?: ManageableComponent
): void;
export declare function updateAppContainerRetrieveKey(newKey: string): string;
