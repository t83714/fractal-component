import * as React from "react";
import ComponentRegistry from "./ComponentRegistry";
import AppContainer from "./AppContainer";
import { Store, Action, Reducer } from "redux";

declare class ComponentManager {
    constructor(
        componentInstance: ManageableComponent,
        options: ManageableComponentOptions,
        appContrainer: AppContainer
    );
    appContrainer: AppContainer;
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
    allowedIncomingMulticastActionTypes: symbol[] | symbol | string;

    initCallback: InitCallback;
    destroyCallback: DestroyCallback;

    enhanceComponentInstance(
        initCallback?: InitCallback,
        destroyCallback?: DestroyCallback
    ): void;
    dispatch(action: Action, relativeDispatchPath?: string): Action;
    getNamespaceData(): any;
    createClassNameGenerator(): () => string;
    init(): void;
    destroy(): void;
}

export default ComponentManager;

export type InitCallback = (cm: ComponentManager) => void;
export type DestroyCallback = (cm: ComponentManager) => void;

export declare const COMPONENT_MANAGER_LOCAL_KEY: Symbol;

export type ManageableComponent = React.Component | React.PureComponent;

export type ComponentStringSettingFunc = (
    cmRef: ComponentManager,
    key: string,
    component: ManageableComponent
) => string;

/**
 * You can store any component namespace related data to `namespaceData` by return the data object from `NamespaceInitCallback`.
 * `NamespaceDestroyCallback` will receive the same data previously returned by `NamespaceInitCallback`.
 * One use case could be storing [JSS](https://github.com/cssinjs/jss) style sheet in `namespaceData` as style sheet only need to
 * be created once among all same type component instance.
 */
export type NamespaceInitCallback = () => object;
export type NamespaceDestroyCallback = (namespaceData: object) => void;

export interface ManageableComponentOptions {
    saga?: GeneratorFunction;
    initState?: object;
    reducer: Reducer;
    namespace?: string | ComponentStringSettingFunc;
    namespacePrefix?: string | ComponentStringSettingFunc;
    componentId?: string | ComponentStringSettingFunc;
    persistState?: boolean;
    isServerSideRendering?: boolean;
    /**
     * Provide all action types supported by your component
     * to make sure actions of those types are serializable
     * via: AppContainerUtils.serialiseAction / AppContainerUtils.deserialiseAction
     * Either provided as array (symbol[]) or object hash
     * (i.e.
     *  {
     *    string : symbol,
     *    string : symbol
     *    ...
     *  }
     * ).
     */
    actionTypes?: symbol[] | object;
    /**
     * By Default, the component will not accept any incoming
     * multicast actions. (Direct address actions will still
     * be delivered)
     *
     * when `allowedIncomingMulticastActionTypes` is string
     * only "*" is accepted (means accepting any actionTypes)
     * If "*" is specified (i.e. accept all), components will
     * only accept multicast actions that are dispatched from
     * or beyond local namespace boundary.
     */
    allowedIncomingMulticastActionTypes?: symbol[] | symbol | string;
    /**
     * namespaceInitCallback & namespaceDestroyCallback will be called once ( among all component instances of the same namespace )
     * It's used for required one-off initlalisation job for all same type component (of the same namespace).
     * e.g. create JSS style sheet for the component
     *
     * when:
     * - namespaceInitCallback: Component namespace has just been created. i.e. at least one Component is created & mounted
     * - namespaceDestroyCallback: Component namespace is destroyed. All components of the namespace are unmounted / destroyed.
     */
    namespaceInitCallback?: NamespaceInitCallback;
    namespaceDestroyCallback?: NamespaceDestroyCallback;
}
