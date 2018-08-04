import {
    take as oTake,
    put as oPut,
    select as oSelect,
    takeEvery as oTakeEvery,
    call,
    delay,
    fork
} from "redux-saga/effects";
import {
    buffers as bufferFactory,
    channel as channelFactory
} from "redux-saga";
import objectPath from "object-path";

function patternMatching(pattern, action) {
    if (!pattern || pattern === "*") return true;
    const { actionType } = action;
    const pType = typeof pattern;
    if (pType === "string") return actionType === pattern;
    else if (pType.toString && typeof pType.toString === "function")
        return actionType === pType.toString();
    else if (pType === "function") return pattern(action);
    else if (isArray(pType)) {
        return (
            typeof pType.find(item => patternMatching(item, action)) !==
            "undefined"
        );
    }
    return false;
}

export function* take(sagaItem, pattern) {
    const { chan } = sagaItem;
    let action;
    do {
        action = yield oTake(chan);
    } while (!patternMatching(pattern, action));
    return action;
}

export function* put(sagaItem, action) {
    const { chan } = sagaItem;
    yield oPut(chan, action);
}

export function* select(sagaItem, selector, ...args) {
    const { path } = sagaItem;
    const pathItems = path.split("/");
    return yield select(state => {
        const namespacedState = objectPath.get(state, pathItems);
        return selector(namespacedState, ...args);
    });
}

export const takeEvery = (sagaItem, pattern, saga, ...args) =>
    fork(function*() {
        while (true) {
            const action = yield take(sagaItem, pattern);
            yield fork(saga, ...args.concat(action));
        }
    });

export const takeLatest = (sagaItem, pattern, saga, ...args) =>
    fork(function*() {
        let lastTask;
        while (true) {
            const action = yield take(sagaItem, pattern);
            if (lastTask) {
                yield cancel(lastTask); // cancel is no-op if the task has already terminated
            }
            lastTask = yield fork(saga, ...args.concat(action));
        }
    });

export const takeLeading = (sagaItem, pattern, saga, ...args) =>
    fork(function*() {
        while (true) {
            const action = yield take(sagaItem, pattern);
            yield call(saga, ...args.concat(action));
        }
    });

export const throttle = (sagaItem, ms, pattern, task, ...args) =>
    fork(function*() {
        const throttleChannel = yield channelFactory(bufferFactory.sliding(1));
        yield takeEvery(sagaItem, "*", function*(action){
            yield oPut(throttleChannel, action);
        });
        while (true) {
            const action = yield oTake(throttleChannel);
            yield fork(task, ...args, action);
            yield delay(ms);
        }
    });
