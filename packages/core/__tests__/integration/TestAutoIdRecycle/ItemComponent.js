import React from "react";
import { useComponentManager } from "fractal-component";

const reducer = state => {
    return state;
};

const ItemComponent = props => {
    useComponentManager(props, {
        namespace: "io.github.t83714/ItemComponent",
        initState: {},
        reducer
    });
    return <div>ItemComponent</div>;
};

export default ItemComponent;
