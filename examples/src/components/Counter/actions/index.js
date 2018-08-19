import * as actionTypes from "./types";
import namespace from "../namespace";

export function increaseCount() {
    return {
        type: actionTypes.INCREASE_COUNT,
        namespace
    };
}