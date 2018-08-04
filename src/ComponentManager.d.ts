import * as React from "react";
import ComponentRegistry from "./ComponentRegistry";

declare class ComponentManager {
    constructor(
        componentInstance: ManageableComponent,
        options: ManageableComponentOptions,
        initCallback?: (ComponentManager) => void,
        destroyCallback?: (ComponentManager) => void
    );
    options: ManageableComponentOptions;
    namespace: string;
    namespacePrefix: string;
    isAutoComponentId: boolean;
    componentId: boolean;
    fullNamespace: string;
    fullPath: string;
}

export default ComponentManager;

export type ManageableComponent = React.Component | React.PureComponent;
export interface ManageableComponentOptions {
    saga?: GeneratorFunction;
    initState?: object;
    reducer: (any) => any;
    namespace?: string | function;
    namespacePrefix?: string | function;
    componentId?: string | function;
    persistState?: boolean;
    isServerSideRendering?: boolean;
}

export declare const CONTAINER_LOCAL_KEY: Symbol;
