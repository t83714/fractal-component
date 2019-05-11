import React from "react";
import { useComponentManager } from "fractal-component";

const reducer = state => {
    return state;
};

const ItemComponent = props => {
    const [state] = useComponentManager(props, {
        namespace: "io.github.t83714/ItemComponent",
        initState: "ItemComponent State Data",
        reducer
    });
    return <div>{state}</div>;
};

export default ItemComponent;
