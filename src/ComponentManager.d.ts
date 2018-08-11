import * as React from "react";
import ComponentRegistry from "./ComponentRegistry";
import { Reducer } from "./ReducerRegistry";
import { Store, Action } from "redux";

declare class ComponentManager {
    constructor(
        componentInstance: ManageableComponent,
        options: ManageableComponentOptions,
        store: Store
    );
    store: Store;
    options: ManageableComponentOptions;
    namespace: string;
    namespacePrefix: string;
    isAutoComponentId: boolean;
    componentId: boolean;
    fullNamespace: string;
    fullPath: string;
    isServerSideRendering: boolean;
    persistState: boolean;
    acceptUpperNamespaceActions: boolean;

    initCallback: InitCallback;
    destroyCallback: DestroyCallback;

    enhanceComponentInstance(
        initCallback: InitCallback = null,
        destroyCallback: DestroyCallback = null
    ): void;
    dispatch(action: Action, relativeDispatchPath: string = ""): Action;
    init(): void;
    destroy(): void;
}

export default ComponentManager;

export type InitCallback = (ComponentManager) => void;
export type DestroyCallback = (ComponentManager) => void;

export declare const COMPONENT_MANAGER_LOCAL_KEY:Symbol;

export type ManageableComponent = React.Component | React.PureComponent;
export interface ManageableComponentOptions {
    saga?: GeneratorFunction;
    initState?: object;
    reducer: Reducer;
    namespace?: string | function;
    namespacePrefix?: string | function;
    componentId?: string | function;
    persistState?: boolean;
    acceptUpperNamespaceActions?: boolean;
    isServerSideRendering?: boolean;
}
