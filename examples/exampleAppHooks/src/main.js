import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import jss from "jss";
import jssDefaultPreset from "jss-preset-default";

import { AppContainer, AppContainerContext } from "fractal-component";
import App from "./components/App";

jss.setup(jssDefaultPreset());

const appContainer = new AppContainer();

ReactDOM.render(
    <AppContainerContext.Provider value={appContainer}>
        <App />
    </AppContainerContext.Provider>,
    document.getElementById("root")
);
