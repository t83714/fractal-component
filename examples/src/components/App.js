import * as React from "react";
//-- import fractal-component lib from src entry point
import { ActionForwarder } from "../../../src/index";
import RandomGif, { actionTypes as randomGifActionTypes } from "./RandomGif";
import RandomGifPair from "./RandomGifPair";
import RandomGifPairPair from "./RandomGifPairPair";
import Counter, { actionTypes as counterActionTypes } from "./Counter";
import ToggleButton from "./ToggleButton";
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
                    {/*Forward `NEW_GIF` actions (and convert to `INCREASE_COUNT`) to ToggleButton for processing*/}
                    <ActionForwarder
                        namespacePrefix="exampleApp/RandomGif"
                        pattern={randomGifActionTypes.NEW_GIF}
                        relativeDispatchPath="../ToggleButton/*"
                        transformer={counterActionTypes.INCREASE_COUNT}
                    />
                </div>
                <div className={classes.cell}>
                    <Counter namespacePrefix="exampleApp/Counter" />
                </div>
            </div>
            <div className={classes.table}>
                <div className={classes.cell}>
                    <RandomGifPair namespacePrefix="exampleApp/RandomGifPair" />
                    {/*Forward `NEW_GIF` actions (and convert to `INCREASE_COUNT`) to ToggleButton for processing*/}
                    <ActionForwarder
                        namespacePrefix="exampleApp/RandomGifPair"
                        pattern={randomGifActionTypes.NEW_GIF}
                        relativeDispatchPath="../ToggleButton/*"
                        transformer={counterActionTypes.INCREASE_COUNT}
                    />
                </div>
                <div className={classes.cell}>
                    {/*
                        ToggleButton acts as a proxy --- depends on its status
                        add an `toggleButtonActive`= true / false field to all actions
                        and then forward actions to Counter
                    */}
                    <ToggleButton 
                        namespacePrefix="exampleApp/ToggleButton"
                        pattern={randomGifActionTypes.INCREASE_COUNT}
                        relativeDispatchPath="../Counter/*"
                        transformer={counterActionTypes.INCREASE_COUNT}
                    />
                </div>
            </div>
            <div>
                <RandomGifPairPair namespacePrefix="exampleApp/RandomGifPairPair" />
                {/*Forward `NEW_GIF` actions (and convert to `INCREASE_COUNT`) to ToggleButton for processing*/}
                <ActionForwarder
                    namespacePrefix="exampleApp/RandomGifPairPair"
                    pattern={randomGifActionTypes.NEW_GIF}
                    relativeDispatchPath="../ToggleButton/*"
                    transformer={counterActionTypes.INCREASE_COUNT}
                />
            </div>
        </div>
    );
}
