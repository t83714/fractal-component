import { createStore, applyMiddleware, compose } from "redux";
import { createSagaMiddleware, channel } from "redux-saga";
import { fork, cancel } from 'redux-saga/effects'

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

const globalSaga = function* (externalSaga){
    try{
        if(externalSaga && typeof externalSaga === "function") {
            try{
                yield fork([this, externalSaga]);
            }catch(e){
                console.error(e);
            }
        }
    }catch(e){

    }finally{

    }
};

class AppContainer {

  constructor(options = defaultOptions) {

      const composeEnhancers = getComposeEnhancers(options.reduxDevToolsDevOnly, options.devToolOptions);
      const sagaMiddleware = createSagaMiddleware(options.sagaMiddlewareOptions);
      const middlewares = [...options.middlewares, sagaMiddleware];
      this.store = createStore(
        options.reducer,
        {...options.initState},
        composeEnhancers(applyMiddleware(middlewares))
      );
      this.gloablSagaTask = sagaMiddleware.run(globalSaga.bind(this), saga);
  }

  getContextValue(){
      return {
        appContainer: this,
        store: this.store
      };
  }

}

export default AppContainer;
