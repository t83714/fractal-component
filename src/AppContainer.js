import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { eventChannel, END } from "redux-saga";
import { fork, cancel, cancelled, call, take } from "redux-saga/effects";
import { RUN_SAGA } from "./AppContainer/actionTypes";
import runSagaSlient from "./utils/runSagaSlient";
import ComponentRegistry from "./ComponentRegistry";

const defaultDevToolOptions = {};
const defaultOptions = {
    reducer: (state, action) => state,
    initState: {},
    middlewares: [],
    reduxDevToolsDevOnly: true,
    //-- https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#windowdevtoolsextensionconfig
    devToolOptions: { ...defaultDevToolOptions },
    //-- https://redux-saga.js.org/docs/api/index.html#createsagamiddlewareoptions
    sagaMiddlewareOptions: {},
    saga: null, //-- global Saga,
    isServerSideRendering: false
};

const getComposeEnhancers = function(devOnly, options) {
    /* eslint-disable-next-line no-underscore-dangle */
    if (!window || !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) return compose;
    if (devOnly && process.env.NODE_ENV === "production") return compose;
    const devToolOptions = {
        ...(options ? options : {})
    };
    /* eslint-disable-next-line no-underscore-dangle */
    return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolOptions);
};

const processChanEvents = function*(chan) {
    try {
        while (true) {
            let { type, payload } = yield take(chan);
            switch (action) {
                case RUN_SAGA:
                    const { saga, args } = payload;
                    yield call(runSagaSlient, saga, args);
                    break;
                default:
                    throw new Error(
                        `Invalid global channel event received: ${action}`
                    );
            }
        }
    } finally {
        if (yield cancelled()) {
            chan.close();
            console.log("Global event channel cancelled");
        }
    }
};

const globalSaga = function*(externalSaga) {
    const globalEventChan = yield call([this, createGlobalEventChan]);
    let chanEventTask = null;
    try {
        if (externalSaga && typeof externalSaga === "function") {
            yield call(runSagaSlient, [this, externalSaga]);
        }
        chanEventTask = yield fork([this, processChanEvents], globalEventChan);
    } finally {
        if (chanEventTask) {
            try {
                yield cancel(chanEventTask);
                chanEventTask = null;
            } catch (e) {
                console.log(
                    `Failed to cancel gloabl channel event processor: ${e.getMessage()}`
                );
            }
        }
    }
};

const createGlobalEventChan = function() {
    return eventChannel(emitter => {
        this.addChanEventLisenter(emitter);
        return () => {
            this.removeChanEventLisenter(emitter);
        };
    });
};

class AppContainer {
    constructor(options = {}) {
        const containerCreationOptions = {
            ...defaultOptions,
            ...options
        };
        const composeEnhancers = getComposeEnhancers(
            containerCreationOptions.reduxDevToolsDevOnly,
            containerCreationOptions.devToolOptions
        );
        const sagaMiddleware = createSagaMiddleware(
            containerCreationOptions.sagaMiddlewareOptions
        );
        const middlewares = [
            ...containerCreationOptions.middlewares,
            sagaMiddleware
        ];
        this.store = createStore(
            containerCreationOptions.reducer,
            { ...containerCreationOptions.initState },
            composeEnhancers(applyMiddleware(...middlewares))
        );
        this.eventEmitters = [];
        this.componentRegistry = new ComponentRegistry();
        this.gloablSagaTask = sagaMiddleware.run(
            globalSaga.bind(this),
            options.saga
        );
    }

    getContextValue() {
        return {
            appContainer: this,
            store: this.store
        };
    }

    addChanEventLisenter(emitter) {
        this.removeChanEventLisenter(emitter);
        this.eventEmitters.push(emitter);
    }

    removeChanEventLisenter(emitter) {
        this.eventEmitters = this.eventEmitters.filter(
            item => item !== emitter
        );
    }

    sendChanEvent(event) {
        this.eventEmitters.forEach(emitter => {
            try {
                emitter(event);
            } catch (e) {
                console.error(e);
            }
        });
    }

    destroy() {}
}

export default AppContainer;
