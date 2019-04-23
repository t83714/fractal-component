import React from "react";
import { useComponentManager } from "fractal-component";
import Temperature from "../../sharedStates/Temperature";
import { toCelsius, tryConvert } from "../../utils";

function BoilingVerdict(props) {
    const [state] = useComponentManager(props, {
        namespace: "io.github.t83714/BoilingVerdict",
        initState: {},
        sharedStates: {
            temperature: Temperature
        }
    });
    const { temperature, scale } = state.temperature;
    const celsius =
        scale === "f" ? tryConvert(temperature, toCelsius) : temperature;
    if (parseFloat(celsius) >= 100) {
        return <p>The water would boil.</p>;
    }
    return <p>The water would not boil.</p>;
}

export default BoilingVerdict;
