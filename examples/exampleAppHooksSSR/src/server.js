// --- ployfill fetch api for nodejs
require("es6-promise").polyfill();
require("isomorphic-fetch");

import "@babel/polyfill";
import express from "express";
import path from "path";
import fs from "fs";

import React from "react";
import { renderToString } from "react-dom/server";

import jss from "jss";
import jssDefaultPreset from "jss-preset-default";

import { AppContainer, AppContainerContext } from "fractal-component";
import App from "./components/App";
import {
    actions as randomGifActions,
    actionTypes as randomGifActionTypes
} from "./components/RandomGif";
import {
    actions as randomGifPairActions,
    actionTypes as randomGifPairActionTypes
} from "./components/RandomGifPair";
import {
    actions as randomGifPairPairActions,
    actionTypes as randomGifPairPairActionTypes
} from "./components/RandomGifPairPair";
import { actionTypes as counterActionTypes } from "./components/Counter";

// --- set JSS css lib default preset https://github.com/cssinjs/jss
jss.setup(jssDefaultPreset());

const app = express();

const htmlTpl = fs.readFileSync(path.resolve(__dirname, "../dist/index.html"), {
    encoding: "utf-8"
});

function htmlTemplate(reactDom, storeData, serverSideStyles) {
    return htmlTpl.replace(
        '<div id="root"></div>',
        `
    <style id="server-side-styles">${serverSideStyles}</style>
    <script>window.appStoreData=${storeData}</script>
    <div id="root">${reactDom}</div>
    `
    );
}

app.get(["/", "/index.html*"], (req, res) => {
    // --- create a new appContainer for serving every request
    const appContainer = new AppContainer();
    /**
     * Render App & passing appContainer down via Context API
     * to make sure every request is served by a different `appContianer`
     */
    const reactDom = renderToString(
        <AppContainerContext.Provider value={appContainer}>
            <App />
        </AppContainerContext.Provider>
    );
    /**
     * Simply way of deciding when to create a redux store snapshot
     * You can have your own logic or make `<App/>` send out an action to indicate initial data loading complete.
     */
    const loadingProgress = {
        isRandomGifLoadingComplete: false,
        isRandomGifError: false,
        isRandomGifPairLoadingComplete: false,
        isRandomGifPairError: false,
        isRandomGifPairPairLoadingComplete: false,
        isRandomGifPairPairError: false,
        increaseCounterEventRecevied: 0
    };

    // --- send multicast actions to trigger data loading
    appContainer.dispatch(randomGifActions.requestNewGif(), "*");
    appContainer.dispatch(randomGifPairActions.requestNewPair(), "*");
    appContainer.dispatch(randomGifPairPairActions.requestNewPairPair(), "*");

    /**
     * `waitForActionsUntil` is a simple helper
     * it calls appContainer.subscribeActionDispatch internally to register an action monitor
     */
    appContainer
        .waitForActionsUntil(action => {
            switch (action.type) {
                case randomGifActionTypes.LOADING_COMPLETE:
                    loadingProgress.isRandomGifLoadingComplete = true;
                    loadingProgress.isRandomGifError = action.payload.isSuccess
                        ? false
                        : true;
                    break;
                case randomGifPairActionTypes.LOADING_COMPLETE:
                    loadingProgress.isRandomGifPairLoadingComplete = true;
                    loadingProgress.isRandomGifPairError = action.payload
                        .isSuccess
                        ? false
                        : true;
                    break;
                case randomGifPairPairActionTypes.LOADING_COMPLETE:
                    loadingProgress.isRandomGifPairPairLoadingComplete = true;
                    loadingProgress.isRandomGifPairPairError = action.payload
                        .isSuccess
                        ? false
                        : true;
                    break;
                case counterActionTypes.INCREASE_COUNT:
                    // --- only count actions sent to `exampleApp/Counter`
                    if (action.currentDispatchPath === "exampleApp/Counter") {
                        loadingProgress.increaseCounterEventRecevied += 1;
                    }
                    break;
            }
            if (
                loadingProgress.isRandomGifLoadingComplete &&
                loadingProgress.isRandomGifPairLoadingComplete &&
                loadingProgress.isRandomGifPairPairLoadingComplete &&
                (loadingProgress.increaseCounterEventRecevied >= 7 || //--- there are 7 Gifs on screen
                    loadingProgress.isRandomGifError ||
                    loadingProgress.isRandomGifPairError ||
                    loadingProgress.isRandomGifPairPairError)
            ) {
                return true;
            }
            return false;
        }, 10000) //--- Timeout after 10 seconds if conditions never meet
        .catch(e => {
            res.status(500).send(e);
        })
        .finally(() => {
            const storeData = JSON.stringify(appContainer.store.getState());
            /**
             * Loop through all namespace data to generate CSS
             */
            const cssContent = appContainer.namespaceRegistry
                .map(({ styleSheet }) =>
                    styleSheet ? styleSheet.toString() : ""
                )
                .join("");
            // --- Destroy appContainer
            // --- All component resource will be released as well
            appContainer.destroy();
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(htmlTemplate(reactDom, storeData, cssContent));
        });
});

app.use(express.static(path.resolve(__dirname, "../dist")));

const port = 3001;
app.listen(port);

// eslint-disable-next-line no-console
console.log(`Project is running at http://localhost:${port}/`);
