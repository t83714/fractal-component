/**
 * Scoped saga effects.
 * recreated from redux saga API documents examples
 */

import {
    take as oTake,
    put as oPut,
    select as oSelect,
    call,
    fork,
    delay
} from "redux-saga/effects";
import {
    buffers as bufferFactory,
    channel as channelFactory
} from "redux-saga";
import objectPath from "object-path";
import { PathContext } from "../PathRegistry";
import { is, log } from "../utils";

export function take(sagaItem, pattern) {
    const { chan } = sagaItem;
    return oTake(chan, pattern);
}

export function put(sagaItem, action, relativeDispatchPath = "") {
    const { path } = sagaItem;
    const pc = new PathContext(path);
    const namespacedAction = pc.convertNamespacedAction(
        action,
        relativeDispatchPath
    );
    
    // --- query action Type's original namespace so that it can be serialised correctly if needed
    const namespace = this.appContainer.actionRegistry.findNamespaceByActionType(namespacedAction.type);
    if(!namespace) {
        log(`Cannot locate namespace for Action \`${newAction.type}\`: \`${newAction.type}\` needs to be registered otherwise the action won't be serializable.`)
    } else {
        namespacedAction.namespace = namespace;
    }

    return oPut(namespacedAction);
}

export function select(sagaItem, selector, ...args) {
    const { path } = sagaItem;
    const pathItems = path.split("/");
    return oSelect(state => {
        const namespacedState = objectPath.get(state, pathItems);
        if (selector && is.func(selector)) {
            return selector(namespacedState, ...args);
        }
        return namespacedState;
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
