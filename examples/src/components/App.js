import * as React from "react";
//-- import fractal-component lib from src entry point
import { ActionForwarder } from "../../../src/index";
import RandomGif, { actionTypes as randomGifActionTypes } from "./RandomGif";
import RandomGifPair from "./RandomGifPair";
import RandomGifPairPair from "./RandomGifPairPair";
import Counter, { actionTypes as counterActionTypes } from "./Counter";
import once from "lodash/once";
import jss from "jss";
import styles from "./App.style";

const createStyleSheet = once(() => {
    return jss.createStyleSheet(styles).attach();
});

export default () => {
    const { classes } = createStyleSheet();
    return (
        <div>
            <div className={classes.table}>
                <div className={classes.cell}>
                    <RandomGif
                        namespacePrefix="exampleApp/RandomGif"
                        hideButton={true}
                    />
                    <ActionForwarder
                        namespacePrefix="exampleApp/RandomGif"
                        pattern={randomGifActionTypes.NEW_GIF}
                        relativeDispatchPath="../Counter/*"
                        transformer={counterActionTypes.INCREASE_COUNT}
                    />
                </div>
                <div className={classes.cell}>
                    <Counter namespacePrefix="exampleApp/Counter" />
                </div>
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
        </div>
    );
}
