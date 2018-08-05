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
    channel as channelFactory,
    isEnd
} from "redux-saga";
import objectPath from "object-path";
import { PathContext } from "../PathRegistry";

export function take(sagaItem, pattern) {
    const { chan } = sagaItem;
    return oTake(chan, pattern);
}

export function put(sagaItem, action, relativeDispatchPath = "") {
    const { path } = sagaItem;
    const pc = new PathContext(path);
    const unnamespacedAction = pc.convertNamespacedAction(
        action,
        relativeDispatchPath
    );
    return oPut(unnamespacedAction);
}

export function select(sagaItem, selector, ...args) {
    const { path } = sagaItem;
    const pathItems = path.split("/");
    return select(state => {
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
        const throttleChannel = yield call(
            channelFactory,
            bufferFactory.sliding(1)
        );
        yield takeEvery(sagaItem, "*", function*(action) {
            yield oPut(throttleChannel, action);
        });
        while (true) {
            const action = yield oTake(throttleChannel);
            yield fork(task, ...args, action);
            yield delay(ms);
        }
    });

export const actionChannel = (sagaItem, pattern, buffer) =>
    call(function*() {
        const { chan } = sagaItem;
        const bufferChan = yield call(channelFactory, buffer);
        try {
            yield fork(function*() {
                while (true) {
                    const action = yield take(chan, pattern);
                    yield put(bufferChan, action);
                }
            });
        } finally {
            if (bufferChan) bufferChan.close();
        }
        return bufferChan;
    });
