import * as actionTypes from "./SagaRegistry/actionTypes";
import * as actions from "./SagaRegistry/actions";
import PathRegistry, { normalize } from "./PathRegistry";
import { log, is } from "./utils";
import EventChannel from "./EventChannel";
import {
    buffers as bufferFactory,
    multicastChannel as multicastChannelFactory
} from "redux-saga";
import * as rsEffects from "redux-saga/effects";
import * as namespacedEffects from "./SagaRegistry/effects";
import namespace from "./SagaRegistry/namespace";

function* hostSaga() {
    yield rsEffects.fork([this, startCommandChan]);
    yield rsEffects.fork([this, forwardNamespacedAction]);
}

const forwardNamespacedAction = function*() {
    yield rsEffects.takeEvery(
        action => is.namespacedAction(action),
        function*(action) {
            const matchedPaths = this.pathRegistry.searchDispatchPaths(action);
            if (!matchedPaths || !matchedPaths.length) return;
            for (let i = 0; i < matchedPaths.length; i++) {
                const sagaItem = this.namespacedSagaItemStore[matchedPaths[i]];
                if (!sagaItem || !sagaItem.chan) continue;
                yield rsEffects.put(sagaItem.chan, action);
            }
        }.bind(this)
    );
};

function* startCommandChan() {
    let commandChan;
    try {
        commandChan = yield rsEffects.call([
            this.hostSagaCommandChan,
            this.hostSagaCommandChan.create
        ]);
        while (true) {
            const action = yield rsEffects.take(commandChan);
            yield rsEffects.fork([this, processCommandAction], action);
        }
    } finally {
        if (yield rsEffects.cancelled()) {
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

function* initSaga(sagaItem) {
    const {
        saga,
        path,
        namespace,
        allowedIncomingMulticastActionTypes
    } = sagaItem;
    const registeredPath = normalize(path);
    if (!registeredPath) {
        yield rsEffects.call([this, initGlobalSaga], saga);
        return;
    }
    const localPathPos = namespace
        ? registeredPath.lastIndexOf(namespace)
        : registeredPath.length;

    if (
        this.pathRegistry.add(registeredPath, {
            localPathPos,
            namespace,
            allowedIncomingMulticastActionTypes
        }) === null
    ) {
        throw new Error(
            `Failed to register namespaced saga: given path \`${registeredPath}\` has been registered.`
        );
    }
    const chan = yield rsEffects.call(multicastChannelFactory);
    const newSagaItem = {
        ...sagaItem,
        chan,
        path: registeredPath,
        allowedIncomingMulticastActionTypes
    };
    const effects = {};
    Object.keys(namespacedEffects).forEach(idx => {
        effects[idx] = namespacedEffects[idx].bind(this, newSagaItem);
    });
    const task = yield rsEffects.fork(function*() {
        try {
            yield rsEffects.call(saga, effects);
        } catch (e) {
            log(
                `Error thrown from saga registered at \`${registeredPath}\`: `,
                "error",
                e
            );
        }
    });
    const registerSagaItem = { ...newSagaItem, task };
    this.namespacedSagaItemStore[registeredPath] = registerSagaItem;
}

function* initGlobalSaga(saga) {
    const task = yield rsEffects.fork(function*() {
        try {
            yield rsEffects.call(saga);
        } catch (e) {
            log("Error thrown from registered global saga: ", "error", e);
        }
    });
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
    constructor(appContainer) {
        this.appContainer = appContainer;
        this.namespacedSagaItemStore = {};
        this.globalSagaTaskList = [];
        this.pathRegistry = new PathRegistry(true);
        this.hostSagaCommandChan = new EventChannel(bufferFactory.expanding());
        this.appContainer.actionRegistry.register(namespace, actionTypes);
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
            ...(is.object(sagaOptions) ? sagaOptions : {})
        };
        this.hostSagaCommandChan.dispatch(actions.initSaga(sagaItem));
    }

    deregister(pathOrTask) {
        if (!pathOrTask)
            throw new Error(
                "SagaRegistry::deregister: pathOrTask parameter cannot be empty!"
            );
        this.hostSagaCommandChan.dispatch(actions.cancelSaga(pathOrTask));
    }

    destroy() {
        this.hostSagaCommandChan.destroy();
        this.appContainer = null;
        this.globalSagaTaskList = [];
        this.pathRegistry.destroy();
    }
}

export default SagaRegistry;
