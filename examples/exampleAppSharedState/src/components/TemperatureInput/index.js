import React from "react";
import PropTypes from "prop-types";
import { useComponentManager } from "fractal-component";
import Temperature, {
    actions as temperatureActions
} from "../../sharedStates/Temperature";
import { toCelsius, toFahrenheit, tryConvert } from "../../utils";

function TemperatureInput(props) {
    const [state, dispatch] = useComponentManager(props, {
        namespace: "io.github.t83714/TemperatureInput",
        initState: {},
        sharedStates: {
            temperature: Temperature
        }
    });

    const { temperature, scale } = state.temperature;
    const celsius =
        scale === "f" ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit =
        scale === "c" ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
        <fieldset>
            <legend>
                Enter temperature in{" "}
                {props.scale === "c" ? "Celsius" : "Fahrenheit"}:
            </legend>
            <input
                value={props.scale === "c" ? celsius : fahrenheit}
                onChange={event => {
                    dispatch(
                        temperatureActions.update(
                            event.target.value,
                            props.scale
                        )
                    );
                }}
            />
        </fieldset>
    );
}

TemperatureInput.propTypes = {
    scale: PropTypes.oneOf(["c", "f"])
};

export default TemperatureInput;
