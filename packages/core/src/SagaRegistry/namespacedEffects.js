/**
 * Scoped saga effects.
 * recreated from redux saga API documents examples
 */

import {
    take as oTake,
    takeMaybe as oTakeMaybe,
    put as oPut,
    select as oSelect,
    call,
    fork,
    delay,
    cancel,
    race
} from "redux-saga/effects";
import {
    buffers as bufferFactory,
    channel as channelFactory
} from "redux-saga";
import objectPath from "object-path";
import { PathContext } from "../PathRegistry";
import { is, log, symbolToString, shallowCopy } from "../utils";

export function take(sagaItem, pattern) {
    if (!pattern)
        throw new Error("effects.take: pattern parameter cannot be empty!");
    const { chan } = sagaItem;
    return oTake(chan, pattern);
}

export function takeMaybe(sagaItem, pattern) {
    if (!pattern)
        throw new Error("effects.take: pattern parameter cannot be empty!");
    const { chan } = sagaItem;
    return oTakeMaybe(chan, pattern);
}

function getSharedStateIndexByActionType(actionType, sagaItem) {
    let { sharedStates } = sagaItem;
    if (!sharedStates) sharedStates = [];
    for (let i = 0; i < sharedStates.length; i++) {
        if (sharedStates[i].container.supportActionType(actionType) === true)
            return i;
    }
    return -1;
}

export function put(sagaItem, action, relativeDispatchPath = "") {
    const { path, sharedStates } = sagaItem;

    const pc = new PathContext(path);
    let isAbsolutePath = false;

    if (relativeDispatchPath === "") {
        const idx = getSharedStateIndexByActionType(action.type, sagaItem);
        if (idx !== -1 && sharedStates) {
            // --- send shared states related actions to shared states container directly
            isAbsolutePath = true;
            relativeDispatchPath = sharedStates[idx].container.fullPath;
        }
    }

    const namespacedAction = pc.convertNamespacedAction(
        action,
        relativeDispatchPath,
        isAbsolutePath
    );

    // --- query action Type's original namespace so that it can be serialised correctly if needed
    const namespace = this.appContainer.actionRegistry.findNamespaceByActionType(
        namespacedAction.type
    );
    if (!namespace) {
        log(
            `Cannot locate namespace for Action \`${symbolToString(
                namespacedAction.type
            )}\`: \`${symbolToString(
                namespacedAction.type
            )}\` needs to be registered otherwise the action won't be serializable.`
        );
    } else {
        namespacedAction.namespace = namespace;
    }

    return oPut(namespacedAction);
}

function getStateDataByFullPath(state, fullPath, makeACopy = false) {
    const pathItems = fullPath.split("/");
    const data = objectPath.get(state, pathItems);
    if (!makeACopy) return data;
    return shallowCopy(data);
}

export function select(sagaItem, selector, ...args) {
    return call(function*() {
        const { path } = sagaItem;
        const { sharedStates } = sagaItem;

        const state = yield oSelect();
        const namespacedState = getStateDataByFullPath(state, path, true);

        if (is.array(sharedStates) && sharedStates.length) {
            // --- auto included shared state for namespacedState
            sharedStates.forEach(({ localKey, container }) => {
                const sharedStateData = getStateDataByFullPath(
                    state,
                    container.fullPath,
                    true
                );
                objectPath.set(namespacedState, localKey, sharedStateData);
            });
        }

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
        yield takeEvery(sagaItem, pattern, function*(action) {
            yield oPut(throttleChannel, action);
        });
        while (true) {
            const action = yield oTake(throttleChannel);
            yield fork(task, ...args, action);
            yield delay(ms);
        }
    });

export const debounce = (sagaItem, ms, pattern, task, ...args) =>
    fork(function*() {
        while (true) {
            let action = yield take(sagaItem, pattern);
            while (true) {
                const { debounced, _action } = yield race({
                    debounced: delay(ms),
                    _action: take(sagaItem, pattern)
                });
                if (debounced) {
                    yield fork(task, ...args, action);
                    break;
                }
                action = _action;
            }
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
