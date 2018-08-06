import * as actionTypes from "./SagaRegistry/actionTypes";
import * as actions from "./SagaRegistry/actions";
import PathRegistry, { normalize } from "./PathRegistry";
import { log } from "./utils";
import EventChannel from "./EventChannel";
import {
    buffers as bufferFactory,
    multicastChannel as multicastChannelFactory
} from "redux-saga";
import * as rsEffects from "redux-saga/effects";
import * as namespacedEffects from "./SagaRegistry/effects";
import partial from "lodash/partial";

function* hostSaga() {
    yield rsEffects.fork([this, startCommandChan]);
    yield rsEffects.fork([this, forwardNamespacedAction]);
}

const forwardNamespacedAction = function*() {
    yield rsEffects.takeEvery(
        action => action.type.indexOf("/@") !== -1,
        function*(action) {
            const lastSepIdx = action.type.lastIndexOf("/@");
            const pureAction = action.type.subString(lastSepIdx + 2);
            const path = normalize(action.type.subString(0, lastSepIdx));
            const matchedPaths = this.pathRegistry.searchSubPath(path);
            if (!matchedPaths || !matchedPaths.length) return;
            const newAction = {
                ...action,
                type: pureAction,
                originType: action.type
            };
            for (let i = 0; i < matchedPaths.length; i++) {
                const sagaItem = this.namespacedSagaItemStore[matchedPaths[i]];
                if(!sageItem || !sagaItem.chan) continue;
                yield rsEffects.put(sageItem.chan, newAction);
            }
        }.bind(this)
    );
};

function* startCommandChan() {
    try {
        const commandChan = yield rsEffects.call([
            this.hostSagaCommandChan,
            this.hostSagaCommandChan.create
        ]);
        while (true) {
            const action = yield rsEffects.take(commandChan);
            yield rsEffects.call([this, processCommandAction], action);
        }
    } finally {
        if (yield rsEffects.cancelled()) {
            log("Terminating GLobal Host Saga Commandline Channel.");
            commandChan.close();
        }
    }
}

function* processCommandAction({ type, payload }) {
    switch (type) {
        case actionTypes.INIT_SAGA:
            yield rsEffects.call([this, initSaga], payload);
            break;
        case actionTypes.CANCEL_SAGA:
            yield rsEffects.call([this, cancelSaga], payload);
            break;
        default:
            throw new Error(`Unknown host command action: ${type}`);
    }
}

function* initSaga(sageItem) {
    const { saga, path, buffer } = sageItem;
    const registeredPath = normalize(path);
    if (!registeredPath) {
        yield rsEffects.call([this, initGlobalSaga], saga);
        return;
    }
    if (this.pathRegistry.add(registeredPath) === null) {
        throw new Error(
            `Failed to register namespaced saga: given path \`${registeredPath}\` has been registered.`
        );
    }
    const chan = yield rsEffects.call(multicastChannelFactory);
    const newSagaItem = { ...sageItem, chan, path: registeredPath };
    const effects = {};
    Object.keys(namespacedEffects).forEach(idx => {
        effects[idx] = partial(namespacedEffects[idx], newSagaItem);
    });
    const task = yield rsEffects.fork(saga, effects);
    const registerSagaItem = { ...newSagaItem, task };
    this.namespacedSagaItemStore[registeredPath] = registerSagaItem;
}

function* initGlobalSaga(saga) {
    const task = yield rsEffects.fork(saga);
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
        yield rsEffects.cancel(sagaItem.task);
    } else {
        Object.keys(this.namespacedSagaItemStore).forEach(idx => {
            if (this.namespacedSagaItemStore[idx].task === pathOrTask) {
                delete this.namespacedSagaItemStore[idx];
            }
        });
        this.globalSagaTaskList = this.globalSagaTaskList.filter(
            s => s !== pathOrTask
        );
        yield rsEffects.cancel(pathOrTask);
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