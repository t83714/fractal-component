import * as React from "react";

declare class ComponentManager {
    constructor(componentInstance: ManageableComponent);
}

export default ComponentManager;

export type ManageableComponent = React.Component | React.PureComponent;
export interface ManageableComponentOptions {
    saga?: Generator;
    initState?: object;
    namespace?: string | function;
    namespacePrefix?: string | function;
    componentId?: string | function;
    persistState?: boolean;
    isServerSideRendering?: boolean;
}
