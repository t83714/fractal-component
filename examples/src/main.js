import "@babel/polyfill";

import * as React from "react";
import ReactDOM from "react-dom";

import jss from "jss";
import jssDefaultPreset from "jss-preset-default";

import { AppContainerUtils } from "../../src/index";
import App from "./components/App";

jss.setup(jssDefaultPreset())

AppContainerUtils.createAppContainer();

ReactDOM.render(<App />, document.getElementById("root"));
