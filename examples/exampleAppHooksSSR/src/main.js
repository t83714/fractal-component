import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import ReactDOM from "react-dom";

import jss from "jss";
import jssDefaultPreset from "jss-preset-default";

import { AppContainer, AppContainerContext } from "fractal-component";
import App from "./components/App";

jss.setup(jssDefaultPreset());

const appContainerOptions = {};
// --- if server side generate initData is avaiable, set initData to redux store
if (window.appStoreData) {
    appContainerOptions.initState = window.appStoreData;
}

const appContainer = new AppContainer(appContainerOptions);

ReactDOM.hydrate(
    <AppContainerContext.Provider value={appContainer}>
        <App />
    </AppContainerContext.Provider>,
    document.getElementById("root"),
    () => {
        try {
            const ssStyles = document.getElementById("server-side-styles");
            ssStyles.parentNode.removeChild(ssStyles);
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
    }
);
