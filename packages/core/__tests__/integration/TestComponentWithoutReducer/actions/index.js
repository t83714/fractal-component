import * as actionTypes from "./types";

export function takeStateSnapshot() {
    return {
        type: actionTypes.TAKE_STATE_SNAPSHOT
    };
}

export function forceRender() {
    return {
        type: actionTypes.FORCE_RENDER
    };
}
