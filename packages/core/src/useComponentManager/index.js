import { useState, useContext, useEffect, useMemo } from "react";
import AppContainerContext from "../AppContainerContext";
import getComponentStub from "./getComponentStub";
import ComponetManager from "../ComponentManager";

export default function useComponentManager(props, options) {
    const initState = options && options.initState ? options.initState : {};
    const [state, setState] = useState(initState);
    const context = useContext(AppContainerContext);
    const componentName = (options && options.name) || "Component";

    const [componentManager, dispatch] = useMemo(() => {
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
        return [cm, cm.dispatch.bind(cm)];
    }, []);

    useEffect(() => {
        componentManager.componentInstance.componentDidMount();
        return () => {
            componentManager.componentInstance.componentWillUnmount();
        };
        // --- [] make sure it will not run for componentDidUpdate
    }, []);
    /**
     * Make sure `useComponentManager` hook return value can be used
     * for either Object or Array destructuring assignment
     * i.e. you can either:
     * - `const [state, dispatch, componentManager] = useComponentManager(props, options)` OR
     * - `const { state, dispatch, componentManager } = useComponentManager(props, options)`
     */
    const r = [state, dispatch, componentManager];
    r.state = state;
    r.dispatch = dispatch;
    r.componentManager = componentManager;
    return r;
}
