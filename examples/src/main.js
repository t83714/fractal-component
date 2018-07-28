import "@babel/polyfill";

import * as React from "react";
import ReactDOM from "react-dom";
import { AppContainerUtils } from "../../src/index";
import sagaMonitor from "./sagaMonitor";

import App from "./components/App";
import reducer from "./reducers";
import rootSaga from "./sagas";

const appContrainer = AppContainerUtils.createAppContainer({
    saga : rootSaga,
    sagaMonitor
});

ReactDOM.render(
    <App />,
    document.getElementById("root")
);