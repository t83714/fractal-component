import AppContainer, { AppContainerOptions } from "./AppContainer";
import {
    ManageableComponent,
    ManageableComponentOptions
} from "./ComponentManager";
import { SagaOptions } from "./SagaRegistry";
import { ReducerOptions } from "./ReducerRegistry";
import { Reducer, Action } from "redux";
import { Task } from "redux-saga";

export function createAppContainer(
    options: AppContainerOptions
): AppContainer;
export function getAppContainer(
    componentInstance?: ManageableComponent
): AppContainer;
export function registerComponent(
    componentInstance: ManageableComponent,
    options: ManageableComponentOptions
): void;
export function deregisterComponent(
    componentInstance: ManageableComponent
): void;
export function registerSaga(
    saga: GeneratorFunction,
    sagaOptions: SagaOptions,
    componentInstance?: ManageableComponent
): void;
export function deregisterSaga(
    pathOrTask: string | Task,
    componentInstance?: ManageableComponent
): void;
export function registerReducer(
    reducer: Reducer,
    reducerOptions: ReducerOptions,
    componentInstance?: ManageableComponent
): void;
export function deregisterReducer(
    path: string,
    componentInstance?: ManageableComponent
): void;
export function registerActions(
    namespace: string,
    actions: symbol | symbol[] | object,
    componentInstance?: ManageableComponent
): void;
export function serialiseAction(
    action: Action,
    componentInstance?: ManageableComponent
): string;
export function deserialiseAction(
    actionJson: string,
    componentInstance?: ManageableComponent
): Action;
export function findNamespaceByActionType(
    actionType: symbol,
    componentInstance?: ManageableComponent
): string;
export function destroyAppContainer(
    componentInstance?: ManageableComponent
): void;
export function updateAppContainerRetrieveKey(newKey: string): string;
