import * as actions from "../actions";
import * as actionTypes from "../actions/types";
import {
    actions as RandomGifActions,
    actionTypes as RandomGifActionTypes
} from "../../RandomGif";

function* mainSaga(effects) {
    let isLoadingStartActionDispatched = false;

    yield effects.takeEvery(RandomGifActionTypes.LOADING_START, function*() {
        if (!isLoadingStartActionDispatched) {
            yield effects.put(actions.loadingStart(), "../../../*");
        }
    });
    yield effects.takeEvery(RandomGifActionTypes.LOADING_COMPLETE, function*() {
        /**
         * throw exposed action out of box
         * It's guaranteed all reducers are run before saga.
         * Therefore, if you get state in a saga via `select` effect,
         * it'll always be applied state.
         */
        const { isLoading, error } = yield effects.select();
        if (!isLoading) {
            yield effects.put(actions.loadingComplete(error), "../../../*");
            isLoadingStartActionDispatched = false;
        }
    });
    // --- monitor `REQUEST_NEW_PAIR` and send multicast actions to RandomGifs
    yield effects.takeEvery(actionTypes.REQUEST_NEW_PAIR, function*() {
        yield effects.put(RandomGifActions.requestNewGif(), "./Gifs/*");
    });
}

export default mainSaga;
