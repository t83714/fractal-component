import * as React from "react";
import PropTypes from "prop-types";
//-- import fractal-component lib from src entry point
import { AppContainerUtils } from "../../../../src/index";

import reducer from "./reducers";
import saga from "./sagas";
import * as actions from "./actions";

class RandomGif extends React.Component {
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
            <div style={{ width: "100px" }}>
                <button onClick={()=>{
                    this.componentManager.dispatch(actions.requestNewGif());
                }} disabled={this.state.isLoading}>
                    {this.state.isLoading ? "Loading..." : "Get Gif"}
                </button>
                {this.state.imageUrl && (
                    <div>
                        <img alt="Gif" src={this.state.imageUrl} style={{ marginTop: "5px" }} />
                    </div>
                )}
            </div>
        );
    }
}

export default RandomGif;