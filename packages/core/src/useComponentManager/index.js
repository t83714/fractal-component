import { useState, useContext, useEffect, useMemo } from "react";
import AppContainerContext from "../AppContainerContext";
import getComponentStub from "./getComponentStub";
import ComponetManager from "../ComponentManager";

export default function useComponentManager(props, options) {
    const initState = options && options.initState ? options.initState : {};
    const context = useContext(AppContainerContext);
    const componentName = (options && options.displayName) || "Component";

    const [
        componentManager,
        dispatch,
        getNamespaceData,
        componentStub
    ] = useMemo(() => {
        // --- will only run once
        const componentStub = getComponentStub(
            initState,
            props,
            context,
            () => {},
            componentName
        );
        const cm = new ComponetManager(componentStub, options);

        return [
            cm,
            cm.dispatch.bind(cm),
            cm.getNamespaceData.bind(cm),
            componentStub
        ];
    }, []);

    const [state, setState] = useState(componentStub.state);

    useMemo(() => {
        componentManager.setState = setState;
        /**
         * This is not the actual render function.
         * this render only trigger `ComponetManager` first stage init
         * then run a noop func
         */
        componentStub.render();
    }, []);

    useEffect(() => {
        componentManager.componentInstance.componentDidMount();
        return () => {
            componentManager.componentInstance.componentWillUnmount();
        };
        /**
         * We will not support change namespace, update reducer etc. during the component lifecycle
         * `[]` here make sure the effect won't be called again due to re-render during the component lifecycle
         */
    }, []);
    /**
     * Make sure `useComponentManager` hook return value can be used
     * for either Object or Array destructuring assignment
     * i.e. you can either:
     * - `const [state, dispatch, componentManager] = useComponentManager(props, options)` OR
     * - `const { state, dispatch, componentManager } = useComponentManager(props, options)`
     */
    const r = [state, dispatch, getNamespaceData, componentManager];
    r.state = state;
    r.dispatch = dispatch;
    r.getNamespaceData = getNamespaceData;
    r.componentManager = componentManager;
    return r;
}
