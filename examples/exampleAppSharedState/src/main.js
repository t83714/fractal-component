import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";

import { AppContainer, AppContainerContext } from "fractal-component";
import BoilingVerdict from "./components/BoilingVerdict";
import TemperatureInput from "./components/TemperatureInput";

const appContainer = new AppContainer();

ReactDOM.render(
    <AppContainerContext.Provider value={appContainer}>
        <div>
            <TemperatureInput scale="c" />
            <TemperatureInput scale="f" />
            <BoilingVerdict />
        </div>
    </AppContainerContext.Provider>,
    document.getElementById("root")
);
