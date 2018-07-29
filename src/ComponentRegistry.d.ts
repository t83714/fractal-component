import * as React from "react";

declare class ComponentRegistry {
    constructor();
    registerComponent(
        componentInstance: RegistrableComponent
    ): void;
}

export default ComponentRegistry;

export type RegistrableComponent = React.Component | React.PureComponent;
