import { useState, useContext, useEffect, useMemo } from "react";
import AppContainerContext from "./AppContainerContext";
import getComponentStub from "./getComponentStub";
import ComponetManager from "../ComponentManager";

export default function useComponentManager(props, options) {
    const initState = options && options.initState ? options.initState : {};
    const [state, setState] = useState(initState);
    const context = useContext(AppContainerContext);
    const componentName = (options && options.name) || "Component";

    const componentManager = useMemo(() => {
        // --- will only run once
        const componentStub = getComponentStub(
            props,
            context,
            setState,
            componentName
        );
        const cm = new ComponetManager(componentStub, options);
        /**
         * This is not the actual render function.
         * this render only trigger `ComponetManager` first stage init
         * then run a noop func
         */
        componentStub.render();
        return cm;
    }, []);

    useEffect(() => {
        componentManager.componentInstance.componentDidMount();
        return () => {
            componentManager.componentInstance.componentWillUnmount();
        };
        // --- [] make sure it will not run for componentDidUpdate
    }, []);

    return [componentManager, state];
}
