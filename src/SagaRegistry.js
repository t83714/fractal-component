import * as actionTypes from "./SagaRegistry/actionTypes";
import * as actions from "./SagaRegistry/actions";
import PathRegistry, { normalize } from "./PathRegistry";
import { log } from "./utils";
import EventChannel from "./EventChannel";
import {
    buffers as bufferFactory,
    channel as channelFactory
} from "redux-saga";
import { cancel } from "redux-saga/effects";
import * as namespacedEffects from "./SagaRegistry/effects";
import objectPath from "object-path";
import objectPathImmutable from "object-path-immutable";
import partialRight from "lodash/partialRight";
import partial from "lodash/partial";

/**
 * This function should NOT return a new state copy
 */
function processInitState(state, action) {
    const { data, isOverwrite, path } = action.payload;
    const pathItems = path.split("/");
    isOverwrite = isOverwrite === false ? false : true;
    objectPath.set(state, pathItems, !isOverwrite);
    return state;
}

/**
 * This function should NOT return a new state copy
 */
function processEmptyState(state, action) {
    const { isOverwrite, path } = action.payload;
    const pathItems = path.split("/");
    objectPath.empty(state, pathItems);
    return state;
}

function processNamespacedAction(state, action) {
    const lastSepIdx = action.type.lastIndexOf("/@");
    if (lastSepIdx === -1) return state;
    const pureAction = action.type.subString(lastSepIdx + 2);
    const path = normalize(action.type.subString(0, lastSepIdx));
    const matchedPaths = this.pathRegistry.searchSubPath(path);
    if (!matchedPaths || !matchedPaths.length) return state;
    const newAction = { ...action, type: pureAction, originType: action.type };
    let newState = state;
    matchedPaths.forEach(p => {
        const { reducer } = this.reducerStore[p];
        if (!reducer || typeof reducer !== "function") return;
        newState = objectPathImmutable.update(
            newState,
            p.split("/"),
            partialRight(reducer, newAction)
        );
    });
    return newState;
}

function* hostSaga() {
    yield fork([this, startCommandChan]);
}

function* startCommandChan() {
    try {
        const commandChan = yield call([
            this.hostSagaCommandChan,
            this.hostSagaCommandChan.create
        ]);
        while (true) {
            const action = yield take(commandChan);
            yield call([this, processCommandAction], action);
        }
    } finally {
        if (yield cancelled()) {
            log("Terminating GLobal Host Saga Commandline Channel.");
            commandChan.close();
        }
    }
}

function* processCommandAction({ type, payload }) {
    switch (type) {
        case actionTypes.INIT_SAGA:
            yield call([this, initSaga], payload);
            break;
        case actionTypes.CANCEL_SAGA:
            yield call([this, cancelSaga], payload);
            break;
        default:
            throw new Error(`Unknown host command action: ${type}`);
    }
}

function* initSaga(sageItem) {
    const { saga, path, buffer } = sageItem;
    const registeredPath = normalize(path);
    if (!registeredPath) {
        yield call([this, initGlobalSaga], saga);
        return;
    }
    if (this.pathRegistry.add(registeredPath) === null) {
        throw new Error(
            `Failed to register namespaced saga: given path \`${registeredPath}\` has been registered.`
        );
    }
    if (!buffer) buffer = bufferFactory.sliding(10);
    const chan = channelFactory(buffer);
    const newSagaItem = { ...sageItem, chan, path: registeredPath };
    const env = {};
    Object.keys(namespacedEffects).forEach(idx => {
        env[idx] = partial(namespacedEffects[idx], newSagaItem);
    });
    const task = yield fork(saga, env);
    const registerSagaItem = { ...newSagaItem, task };
    this.namespacedSagaItemStore[registeredPath] = registerSagaItem;
}

function* initGlobalSaga(saga) {
    const task = yield fork(saga);
    this.globalSagaTaskList.push(task);
}

function* cancelSaga(pathOrTask) {
    if (typeof pathOrTask === "string") {
        const path = normalize(pathOrTask);
        this.pathRegistry.remove(path);
        const sagaItem = this.namespacedSagaItemStore[path];
        if (!sagaItem) return;
        delete this.namespacedSagaItemStore[path];
        sagaItem.chan.close();
        yield cancel(sagaItem.task);
    } else {
        Object.keys(this.namespacedSagaItemStore).forEach(idx => {
            if (this.namespacedSagaItemStore[idx].task === pathOrTask) {
                delete this.namespacedSagaItemStore[idx];
            }
        });
        this.globalSagaTaskList = this.globalSagaTaskList.filter(s => s !== pathOrTask);
        yield cancel(pathOrTask);
    }
}

class SagaRegistry {
    constructor() {
        this.namespacedSagaItemStore = {};
        this.globalSagaTaskList = [];
        this.pathRegistry = new PathRegistry();
        this.hostSagaCommandChan = new EventChannel(bufferFactory.expanding());
    }

    createHostSaga() {
        return hostSaga.bind(this);
    }

    register(saga, sagaOptions) {
        if (!saga || typeof saga !== "function")
            throw new Error(
                "SagaRegistry::register: saga parameter cannot be empty!"
            );
        const sagaItem = {
            saga,
            ...(typeof sagaOptions !== "object" ? sagaOptions : {})
        };
        const { path, buffer } = sagaOptions;
        if (path && !buffer) {
            sagaItem.buffer = bufferFactory.sliding(10);
        }
        this.hostSagaCommandChan.dispatch(actions.initSaga(sagaItem));
    }

    deregister(pathOrTask) {
        if (!pathOrTask)
            throw new Error(
                "SagaRegistry::deregister: pathOrTask parameter cannot be empty!"
            );
        this.hostSagaCommandChan.dispatch(actions.cancelSaga(pathOrTask));
    }
}

export default SagaRegistry;
