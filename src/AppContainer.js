import { createStore, applyMiddleware, compose } from "redux";
import { createSagaMiddleware, eventChannel, END } from "redux-saga";
import { fork, cancel, cancelled } from "redux-saga/effects";
import * as _ from "lodash";

const defaultOptions = {
  reducer: (state, action) => state,
  initState: {},
  middlewares: [],
  reduxDevToolsDevOnly: true,
  //-- https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#windowdevtoolsextensionconfig
  devToolOptions: {},
  //-- https://redux-saga.js.org/docs/api/index.html#createsagamiddlewareoptions
  sagaMiddlewareOptions: {},
  saga: null //-- global Saga
};

const getComposeEnhancers = function(devOnly, options) {
  /* eslint-disable-next-line no-underscore-dangle */
  if (!window || !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) return compose;
  if (devOnly && process.env.NODE_ENV === "production") return compose;
  /* eslint-disable-next-line no-underscore-dangle */
  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(options);
};

const runSubSaga = function*(saga){
    try{
        yield fork(saga);
    }catch(e){
        console.error(e);
    }
}

const processChanEvents = function*(chan){
    try {    
        while (true) {
            let event = yield take(chan);

        }
    } finally {
        if (yield cancelled()) {
            chan.close();
            console.log('Global event channel cancelled');
        }    
    }
}

const globalSaga = function*(externalSaga) {
  const globalEventChan = yield call([this, createGlobalEventChan]);
  let chanEventTask = null;
  try {
    yield call(runSubSaga, [this, externalSaga]);
    yield fork([this, processChanEvents]);
  } catch (e) {
    console.error(e);
  } finally {
    if(chanEventTask) {
        try{
            yield cancel(chanEventTask);
            chanEventTask = null;
        }catch(e){
            console.log(`Failed to cancel gloabl channel event processor: ${e.getMessage()}`);
        }
        
    }
  }
};

const createGlobalEventChan = function() {
  return eventChannel(emitter => {
    this.addChanEventLisenter(emitter);
    return ()=>{
        this.removeChanEventLisenter(emitter);
    };
  });
};

class AppContainer {
  constructor(options = defaultOptions) {
    const composeEnhancers = getComposeEnhancers(
      options.reduxDevToolsDevOnly,
      options.devToolOptions
    );
    const sagaMiddleware = createSagaMiddleware(options.sagaMiddlewareOptions);
    const middlewares = [...options.middlewares, sagaMiddleware];
    this.store = createStore(
      options.reducer,
      { ...options.initState },
      composeEnhancers(applyMiddleware(middlewares))
    );
    this.eventEmitters = {};
    this.gloablSagaTask = sagaMiddleware.run(globalSaga.bind(this), saga);
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
    this.eventEmitters = this.eventEmitters.filter(item => item !== emitter);
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
}

export default AppContainer;
