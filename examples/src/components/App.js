import * as React from "react";
//-- import fractal-component lib from src entry point
import { AppContainerUtils, ActionForwarder } from "../../../src/index";
import RandomGif from "./RandomGif";
import Counter from "./Counter";

export default () => (
    <div>
        <RandomGif namespacePrefix="exampleApp/RandomGif" />



        <ActionForwarder
            namespace="exampleApp/RandomGif"
            pattern="NEW_GIF"
            relativeDispatchPath="../Counter/*"
            transformer="INCREASE_COUNT"
        />
        <Counter namespacePrefix="exampleApp/Counter" />
    </div>
);
