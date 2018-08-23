import * as actionTypes from "./types";
import namespace from "../namespace";

export function click() {
    return {
        type: actionTypes.CLICK,
        namespace
    };
}