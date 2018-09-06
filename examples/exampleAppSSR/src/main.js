import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import jss from "jss";
import jssDefaultPreset from "jss-preset-default";

import { AppContainerUtils } from "fractal-component";
import App from "./components/App";

jss.setup(jssDefaultPreset());

const appContainerOptions = {};
// --- if server side generate initData is avaiable, set initData to redux store
if (window.appStoreData) {
    appContainerOptions.initState = window.appStoreData;
}

AppContainerUtils.createAppContainer(appContainerOptions);

ReactDOM.hydrate(<App />, document.getElementById("root"), () => {
    try {
        const ssStyles = document.getElementById("server-side-styles");
        ssStyles.parentNode.removeChild(ssStyles);
    } catch (e) {
        console.log(e);
    }
});
