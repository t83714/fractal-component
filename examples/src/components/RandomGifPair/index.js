import * as React from "react";
//-- import fractal-component lib from src entry point
import { AppContainerUtils } from "../../../../src/index";

import reducer from "./reducers";
import saga from "./sagas";
import * as actions from "./actions";

import RandomGif from "../RandomGif";

class RandomGifPair extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading : false,
            imageUrl : null
        };
        this.componentManager = AppContainerUtils.registerComponent(this,{
            namespace: "io.github.t83714/NewGif",
            reducer: reducer,
            saga: saga
        });
    }

    render() {
        return (
            <div>
                <div></div>
                <div></div>
            </div>
        );
    }
}

export default RandomGif;