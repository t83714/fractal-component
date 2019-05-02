import { createSharedState } from "fractal-component";
import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import reducer, { initState } from "./reducers";

const SharedStateA = createSharedState({
    namespace: "io.github.t83714/SharedStateA",
    actionTypes,
    reducer,
    initState: initState()
});

export default SharedStateA;
export { actionTypes, actions };
