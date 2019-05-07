import { createSharedState } from "fractal-component";
import * as actions from "./actions";
import * as actionTypes from "./actions/types";
import reducer, { initState } from "./reducers";

const Temperature = createSharedState({
    namespace: "io.github.t83714/SharedState/Temperature",
    actionTypes,
    reducer,
    initState: initState()
});

export default Temperature;
export { actionTypes, actions };
