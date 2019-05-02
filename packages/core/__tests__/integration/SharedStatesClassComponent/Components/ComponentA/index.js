import React from "react";
import { ComponentManager, AppContainerContext } from "fractal-component";
import reducer, { initState } from "./reducers";
import * as actionTypes from "./actions/types";

function createComponentA(
    sharedStates = null,
    saga = null,
    renderFunc = () => null
) {
    class ComponentA extends React.Component {
        constructor(props) {
            super(props);
            this.state = initState();
            this.componentManager = new ComponentManager(this, {
                namespace: "io.github.t83714/ComponentA",
                sharedStates,
                actionTypes,
                reducer,
                saga
            });
        }

        render() {
            return renderFunc(this.state, this.componentManager.dispatch);
        }
    }
    ComponentA.contextType = AppContainerContext;
    return ComponentA;
}

export default createComponentA;
