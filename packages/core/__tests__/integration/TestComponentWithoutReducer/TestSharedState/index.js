import { createSharedState } from "fractal-component";
import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import reducer, { initState } from "./reducers";

const TestSharedState = createSharedState({
    namespace: "io.github.t83714/TestSharedState",
    actionTypes,
    reducer,
    initState: initState()
});

export default TestSharedState;
export { actionTypes, actions };
