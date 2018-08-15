import * as React from "react";
//-- import fractal-component lib from src entry point
import { AppContainerUtils } from "../../../../src/index";
import * as actionTypes from "./actions/types";
import * as actions from "./actions/index";

class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714",
            reducer: function(state, action) {
                switch (action.type) {
                    case actionTypes.INCREASE_COUNT:
                        return { ...state, count: state.count + 1 };
                    default:
                        return state;
                }
            }
        });
    }

    render() {
        return <p>Counter: {this.state.count}</p>;
    }
}

export default Counter;

export { actionTypes, actions };
