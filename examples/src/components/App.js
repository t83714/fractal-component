import * as React from "react";
//-- import fractal-component lib from src entry point
import { ActionForwarder } from "../../../src/index";
import RandomGif, { actionTypes as randomGifActionTypes} from "./RandomGif";
import RandomGifPair from "./RandomGifPair";
import RandomGifPairPair from "./RandomGifPairPair";
import Counter, {actionTypes as counterActionTypes} from "./Counter";

export default () => (
    <div>
        <div>
            <RandomGif namespacePrefix="exampleApp/RandomGif" hideButton={true} />
            <ActionForwarder
                namespacePrefix="exampleApp/RandomGif"
                pattern={randomGifActionTypes.NEW_GIF}
                relativeDispatchPath="../Counter/*"
                transformer={counterActionTypes.INCREASE_COUNT}
            />
        </div>
        <div>
            <RandomGifPair namespacePrefix="exampleApp/RandomGifPair" />
            <ActionForwarder
                namespacePrefix="exampleApp/RandomGifPair"
                pattern={randomGifActionTypes.NEW_GIF}
                relativeDispatchPath="../Counter/*"
                transformer={counterActionTypes.INCREASE_COUNT}
            />
        </div>
        <div>
            <RandomGifPairPair namespacePrefix="exampleApp/RandomGifPairPair" />
            <ActionForwarder
                namespacePrefix="exampleApp/RandomGifPairPair"
                pattern={randomGifActionTypes.NEW_GIF}
                relativeDispatchPath="../Counter/*"
                transformer={counterActionTypes.INCREASE_COUNT}
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
