import "@babel/polyfill";

import * as React from "react";
import ReactDOM from "react-dom";

import { AppContainerUtils } from "../../src/index";
import App from "./components/App";

AppContainerUtils.createAppContainer();

ReactDOM.render(<App />, document.getElementById("root"));
