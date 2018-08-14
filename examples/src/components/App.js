import * as React from "react";
//-- import fractal-component lib from src entry point
import { ActionForwarder } from "../../../src/index";
import RandomGif from "./RandomGif";
import RandomGifPair from "./RandomGifPair";
import RandomGifPairPair from "./RandomGifPairPair";
import Counter from "./Counter";

export default () => (
    <div>
        <div>
            <RandomGif namespacePrefix="exampleApp/RandomGif" hideButton={true} />
            <ActionForwarder
                namespacePrefix="exampleApp/RandomGif"
                pattern="NEW_GIF"
                relativeDispatchPath="../Counter/*"
                transformer="INCREASE_COUNT"
            />
        </div>
        <div>
            <RandomGifPair namespacePrefix="exampleApp/RandomGifPair" />
            <ActionForwarder
                namespacePrefix="exampleApp/RandomGifPair"
                pattern="NEW_GIF"
                relativeDispatchPath="../Counter/*"
                transformer="INCREASE_COUNT"
            />
        </div>
        <div>
            <RandomGifPairPair namespacePrefix="exampleApp/RandomGifPairPair" />
            <ActionForwarder
                namespacePrefix="exampleApp/RandomGifPairPair"
                pattern="NEW_GIF"
                relativeDispatchPath="../Counter/*"
                transformer="INCREASE_COUNT"
            />
        </div>

        <Counter namespacePrefix="exampleApp/Counter" />

        <div>
            <div style={{ textAlign: "center", color: "red" }}>Random Gif</div>
            <div>
                <img width="100px" />
            </div>
        </div>
    </div>
);
