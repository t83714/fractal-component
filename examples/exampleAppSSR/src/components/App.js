import React from "react";
import PropTypes from "prop-types";
//-- import fractal-component lib from src entry point
import { ActionForwarder, AppContainer, utils } from "fractal-component";
import RandomGif, { actionTypes as randomGifActionTypes } from "./RandomGif";
import RandomGifPair from "./RandomGifPair";
import RandomGifPairPair from "./RandomGifPairPair";
import Counter, { actionTypes as counterActionTypes } from "./Counter";
import ToggleButton from "./ToggleButton";
import once from "lodash/once";
import jss from "jss";
import styles from "./App.style";

const createStyleSheet = once(() => {
    return jss
        .createStyleSheet(styles, {
            generateClassName: utils.createClassNameGenerator("exampleApp")
        })
        .attach();
});

export default function App(props) {
    const { classes } = createStyleSheet();
    return (
        <div>
            <div className={classes.table}>
                <div className={classes.cell}>
                    {/*
                        RandomGif / RandomGifPair / RandomGifPairPair support apiKey property as well
                        You can supply your giphy API key as component property
                    */}
                    <RandomGif
                        namespacePrefix="exampleApp/RandomGif"
                        /**
                         * Passing down appContainer
                         * as there might be more than one appContainer running at the same time
                         * you can also pass down appContainer using `context`
                         */
                        appContainer={props.appContainer}
                    />
                    {/*Forward `NEW_GIF` actions (and convert to `INCREASE_COUNT`) to ToggleButton for processing*/}
                    <ActionForwarder
                        namespacePrefix="exampleApp/RandomGif"
                        pattern={randomGifActionTypes.NEW_GIF}
                        relativeDispatchPath="../ToggleButton/*"
                        transformer={counterActionTypes.INCREASE_COUNT}
                        appContainer={props.appContainer}
                    />
                </div>
                <div className={classes.cell}>
                    <Counter
                        namespacePrefix="exampleApp/Counter"
                        appContainer={props.appContainer}
                    />
                </div>
            </div>
            <div className={classes.table}>
                <div className={classes.cell}>
                    <RandomGifPair
                        namespacePrefix="exampleApp/RandomGifPair"
                        appContainer={props.appContainer}
                    />
                    {/*Forward `NEW_GIF` actions (and convert to `INCREASE_COUNT`) to ToggleButton for processing*/}
                    <ActionForwarder
                        namespacePrefix="exampleApp/RandomGifPair"
                        pattern={randomGifActionTypes.NEW_GIF}
                        relativeDispatchPath="../ToggleButton/*"
                        transformer={counterActionTypes.INCREASE_COUNT}
                        appContainer={props.appContainer}
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
                        appContainer={props.appContainer}
                    />
                </div>
            </div>
            <div>
                <RandomGifPairPair
                    namespacePrefix="exampleApp/RandomGifPairPair"
                    appContainer={props.appContainer}
                />
                {/*Forward `NEW_GIF` actions (and convert to `INCREASE_COUNT`) to ToggleButton for processing*/}
                <ActionForwarder
                    namespacePrefix="exampleApp/RandomGifPairPair"
                    pattern={randomGifActionTypes.NEW_GIF}
                    relativeDispatchPath="../ToggleButton/*"
                    transformer={counterActionTypes.INCREASE_COUNT}
                    appContainer={props.appContainer}
                />
            </div>
        </div>
    );
}

App.propTypes = {
    appContainer: PropTypes.instanceOf(AppContainer)
};
