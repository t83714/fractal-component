import * as actionTypes from "./types";

export function update(temperature, scale) {
    return {
        type: actionTypes.UPDATE,
        payload: {
            temperature,
            scale
        }
    };
}
