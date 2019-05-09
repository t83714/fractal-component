import React from "react";
import { useComponentManager } from "fractal-component";
import * as actionTypes from "./actions/types";
import ItemComponent from "../ItemComponent";

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_DATA:
            return action.payload;
        default:
            return state;
    }
};

const ListComponent = props => {
    const [state] = useComponentManager(props, {
        namespace: "io.github.t83714/ListComponent",
        initState: [],
        actionTypes,
        reducer
    });

    const items = state
        .map((v, idx) => (v ? <ItemComponent key={idx} /> : null))
        .filter(e => (e ? true : false));
    return <div>{items}</div>;
};

export default ListComponent;
