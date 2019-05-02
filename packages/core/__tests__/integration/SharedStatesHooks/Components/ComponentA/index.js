import { useComponentManager } from "fractal-component";
import reducer, { initState } from "./reducers";
import * as actionTypes from "./actions/types";

function createComponentA(
    sharedStates = null,
    saga = null,
    renderFunc = () => null
) {
    return props => {
        const [state, dispatch] = useComponentManager(props, {
            namespace: "io.github.t83714/ComponentA",
            initState: initState(),
            sharedStates,
            actionTypes,
            reducer,
            saga
        });
        return renderFunc(state, dispatch);
    };
}

export default createComponentA;
