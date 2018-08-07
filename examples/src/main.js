import "@babel/polyfill";

import * as React from "react";
import ReactDOM from "react-dom";
import { AppContainerUtils } from "../../src/index";

import App from "./components/App";

const appContrainer = AppContainerUtils.createAppContainer();

ReactDOM.render(
    <App />,
    document.getElementById("root")
);