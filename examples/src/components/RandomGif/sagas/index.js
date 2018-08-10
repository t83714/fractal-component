import * as actionTypes from "../actions/types";
import * as actions from "../actions";
import { call } from "redux-saga/effects";

function fetchGif() {
    return fetch(
        "https://api.giphy.com/v1/gifs/random?api_key=Y4P38sTJAgEBOHP1B3sVs0Jtk01tb6fA"
    ).then(response => response.json())
}

/**
 * All user defined saga will be passed with `effects` object with the following:
 * @param {Object} effects
 * @param {function} effects.take - e.g. yield effects.take(actionPattern)
 * @param {function} effects.put - e.g. yield effects.put(action,optionalRelativeDispatchPath)
 * @param {function} effects.select - e.g. yield effects.take(actionPattern)
 * @param {function} effects.takeEvery
 * @param {function} effects.takeLatest
 * @param {function} effects.takeLeading
 * @param {function} effects.throttle
 * @param {function} effects.actionChannel
 * 
 * Those effects are provide the same functionality as the `effects` provided by `redux-saga` (https://redux-saga.js.org/docs/api/)
 * except any action related effects are namespaced. i.e. You only see actions are sent to your namespace.
 * You can, however, opt to receive at global level (i.e. receive all actions) by using `effects` import from `redux-saga`.
 * e.g. 
 *  import { take } from "redux-saga/effects"; 
 *  const action = yield take("*"); //--- take an `any` action from global level
 */
const mainSaga = function*(effects) {
    yield effects.takeLeading(actionTypes.REQUEST_NEW_GIF, function*() {
        try {
            const response = yield call(fetchGif);
            const imgUrl = response.data.fixed_width_small_url;
            yield effects.put(actions.receiveNewGif(imgUrl));
            /**
             * The optional second `relativeDispatchPath` parameter defines
             * the relative (from current componet namespace) namespace dispatch path.
             * i.e. current component full namespace path is:
             *     namespace:              random componet ID
             * `io.github.t83714` +"/"+ `NewGif-xxxxxxxxx`
             * e.g. `io.github.t83714/NewGif-4n5pxq24kpiob12og9`
             * If `relativeDispatchPath` is `../../*`, all namespace direct parents will get action `NEW_GIF`
             * Although, theoretically, you could use `relativeDispatchPath` & ".." to dispatch the action 
             * into any namespace, you should throw the action just out of the your box.
             * --- because as a component author, you are supposed to know nothing about outside world.
             */
            //--- optional second `relativeDispatchPath` parameter
            //--- specify the action dispatch path
            yield effects.put(actions.newGif(), "../../*");
        } catch (e) {
            console.log(e);
            throw e;
        }
    });
};
export default mainSaga;
