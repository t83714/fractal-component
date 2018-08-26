(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('prop-types')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react', 'prop-types'], factory) :
	(factory((global.FractalComponent = {}),global.React,global.PropTypes));
}(this, (function (exports,React,PropTypes) { 'use strict';

	React = React && React.hasOwnProperty('default') ? React['default'] : React;
	PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _extends_1 = createCommonjsModule(function (module) {
	function _extends() {
	  module.exports = _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends.apply(this, arguments);
	}

	module.exports = _extends;
	});

	function symbolObservablePonyfill(root) {
		var result;
		var Symbol = root.Symbol;

		if (typeof Symbol === 'function') {
			if (Symbol.observable) {
				result = Symbol.observable;
			} else {
				result = Symbol('observable');
				Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	}

	/* global window */

	var root;

	if (typeof self !== 'undefined') {
	  root = self;
	} else if (typeof window !== 'undefined') {
	  root = window;
	} else if (typeof global !== 'undefined') {
	  root = global;
	} else if (typeof module !== 'undefined') {
	  root = module;
	} else {
	  root = Function('return this')();
	}

	var result = symbolObservablePonyfill(root);

	/**
	 * These are private action types reserved by Redux.
	 * For any unknown actions, you must return the current state.
	 * If the current state is undefined, you must return the initial state.
	 * Do not reference these action types directly in your code.
	 */
	var ActionTypes = {
	  INIT: '@@redux/INIT' + Math.random().toString(36).substring(7).split('').join('.'),
	  REPLACE: '@@redux/REPLACE' + Math.random().toString(36).substring(7).split('').join('.')
	};

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
	  return typeof obj;
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	var _extends = Object.assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

	/**
	 * @param {any} obj The object to inspect.
	 * @returns {boolean} True if the argument appears to be a plain object.
	 */
	function isPlainObject(obj) {
	  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj === null) return false;

	  var proto = obj;
	  while (Object.getPrototypeOf(proto) !== null) {
	    proto = Object.getPrototypeOf(proto);
	  }

	  return Object.getPrototypeOf(obj) === proto;
	}

	/**
	 * Creates a Redux store that holds the state tree.
	 * The only way to change the data in the store is to call `dispatch()` on it.
	 *
	 * There should only be a single store in your app. To specify how different
	 * parts of the state tree respond to actions, you may combine several reducers
	 * into a single reducer function by using `combineReducers`.
	 *
	 * @param {Function} reducer A function that returns the next state tree, given
	 * the current state tree and the action to handle.
	 *
	 * @param {any} [preloadedState] The initial state. You may optionally specify it
	 * to hydrate the state from the server in universal apps, or to restore a
	 * previously serialized user session.
	 * If you use `combineReducers` to produce the root reducer function, this must be
	 * an object with the same shape as `combineReducers` keys.
	 *
	 * @param {Function} [enhancer] The store enhancer. You may optionally specify it
	 * to enhance the store with third-party capabilities such as middleware,
	 * time travel, persistence, etc. The only store enhancer that ships with Redux
	 * is `applyMiddleware()`.
	 *
	 * @returns {Store} A Redux store that lets you read the state, dispatch actions
	 * and subscribe to changes.
	 */
	function createStore(reducer, preloadedState, enhancer) {
	  var _ref2;

	  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
	    enhancer = preloadedState;
	    preloadedState = undefined;
	  }

	  if (typeof enhancer !== 'undefined') {
	    if (typeof enhancer !== 'function') {
	      throw new Error('Expected the enhancer to be a function.');
	    }

	    return enhancer(createStore)(reducer, preloadedState);
	  }

	  if (typeof reducer !== 'function') {
	    throw new Error('Expected the reducer to be a function.');
	  }

	  var currentReducer = reducer;
	  var currentState = preloadedState;
	  var currentListeners = [];
	  var nextListeners = currentListeners;
	  var isDispatching = false;

	  function ensureCanMutateNextListeners() {
	    if (nextListeners === currentListeners) {
	      nextListeners = currentListeners.slice();
	    }
	  }

	  /**
	   * Reads the state tree managed by the store.
	   *
	   * @returns {any} The current state tree of your application.
	   */
	  function getState() {
	    if (isDispatching) {
	      throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
	    }

	    return currentState;
	  }

	  /**
	   * Adds a change listener. It will be called any time an action is dispatched,
	   * and some part of the state tree may potentially have changed. You may then
	   * call `getState()` to read the current state tree inside the callback.
	   *
	   * You may call `dispatch()` from a change listener, with the following
	   * caveats:
	   *
	   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
	   * If you subscribe or unsubscribe while the listeners are being invoked, this
	   * will not have any effect on the `dispatch()` that is currently in progress.
	   * However, the next `dispatch()` call, whether nested or not, will use a more
	   * recent snapshot of the subscription list.
	   *
	   * 2. The listener should not expect to see all state changes, as the state
	   * might have been updated multiple times during a nested `dispatch()` before
	   * the listener is called. It is, however, guaranteed that all subscribers
	   * registered before the `dispatch()` started will be called with the latest
	   * state by the time it exits.
	   *
	   * @param {Function} listener A callback to be invoked on every dispatch.
	   * @returns {Function} A function to remove this change listener.
	   */
	  function subscribe(listener) {
	    if (typeof listener !== 'function') {
	      throw new Error('Expected the listener to be a function.');
	    }

	    if (isDispatching) {
	      throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
	    }

	    var isSubscribed = true;

	    ensureCanMutateNextListeners();
	    nextListeners.push(listener);

	    return function unsubscribe() {
	      if (!isSubscribed) {
	        return;
	      }

	      if (isDispatching) {
	        throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
	      }

	      isSubscribed = false;

	      ensureCanMutateNextListeners();
	      var index = nextListeners.indexOf(listener);
	      nextListeners.splice(index, 1);
	    };
	  }

	  /**
	   * Dispatches an action. It is the only way to trigger a state change.
	   *
	   * The `reducer` function, used to create the store, will be called with the
	   * current state tree and the given `action`. Its return value will
	   * be considered the **next** state of the tree, and the change listeners
	   * will be notified.
	   *
	   * The base implementation only supports plain object actions. If you want to
	   * dispatch a Promise, an Observable, a thunk, or something else, you need to
	   * wrap your store creating function into the corresponding middleware. For
	   * example, see the documentation for the `redux-thunk` package. Even the
	   * middleware will eventually dispatch plain object actions using this method.
	   *
	   * @param {Object} action A plain object representing “what changed”. It is
	   * a good idea to keep actions serializable so you can record and replay user
	   * sessions, or use the time travelling `redux-devtools`. An action must have
	   * a `type` property which may not be `undefined`. It is a good idea to use
	   * string constants for action types.
	   *
	   * @returns {Object} For convenience, the same action object you dispatched.
	   *
	   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
	   * return something else (for example, a Promise you can await).
	   */
	  function dispatch(action) {
	    if (!isPlainObject(action)) {
	      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
	    }

	    if (typeof action.type === 'undefined') {
	      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
	    }

	    if (isDispatching) {
	      throw new Error('Reducers may not dispatch actions.');
	    }

	    try {
	      isDispatching = true;
	      currentState = currentReducer(currentState, action);
	    } finally {
	      isDispatching = false;
	    }

	    var listeners = currentListeners = nextListeners;
	    for (var i = 0; i < listeners.length; i++) {
	      var listener = listeners[i];
	      listener();
	    }

	    return action;
	  }

	  /**
	   * Replaces the reducer currently used by the store to calculate the state.
	   *
	   * You might need this if your app implements code splitting and you want to
	   * load some of the reducers dynamically. You might also need this if you
	   * implement a hot reloading mechanism for Redux.
	   *
	   * @param {Function} nextReducer The reducer for the store to use instead.
	   * @returns {void}
	   */
	  function replaceReducer(nextReducer) {
	    if (typeof nextReducer !== 'function') {
	      throw new Error('Expected the nextReducer to be a function.');
	    }

	    currentReducer = nextReducer;
	    dispatch({ type: ActionTypes.REPLACE });
	  }

	  /**
	   * Interoperability point for observable/reactive libraries.
	   * @returns {observable} A minimal observable of state changes.
	   * For more information, see the observable proposal:
	   * https://github.com/tc39/proposal-observable
	   */
	  function observable() {
	    var _ref;

	    var outerSubscribe = subscribe;
	    return _ref = {
	      /**
	       * The minimal observable subscription method.
	       * @param {Object} observer Any object that can be used as an observer.
	       * The observer object should have a `next` method.
	       * @returns {subscription} An object with an `unsubscribe` method that can
	       * be used to unsubscribe the observable from the store, and prevent further
	       * emission of values from the observable.
	       */
	      subscribe: function subscribe(observer) {
	        if ((typeof observer === 'undefined' ? 'undefined' : _typeof(observer)) !== 'object' || observer === null) {
	          throw new TypeError('Expected the observer to be an object.');
	        }

	        function observeState() {
	          if (observer.next) {
	            observer.next(getState());
	          }
	        }

	        observeState();
	        var unsubscribe = outerSubscribe(observeState);
	        return { unsubscribe: unsubscribe };
	      }
	    }, _ref[result] = function () {
	      return this;
	    }, _ref;
	  }

	  // When a store is created, an "INIT" action is dispatched so that every
	  // reducer returns their initial state. This effectively populates
	  // the initial state tree.
	  dispatch({ type: ActionTypes.INIT });

	  return _ref2 = {
	    dispatch: dispatch,
	    subscribe: subscribe,
	    getState: getState,
	    replaceReducer: replaceReducer
	  }, _ref2[result] = observable, _ref2;
	}

	/**
	 * Prints a warning in the console if it exists.
	 *
	 * @param {String} message The warning message.
	 * @returns {void}
	 */
	function warning(message) {
	  /* eslint-disable no-console */
	  if (typeof console !== 'undefined' && typeof console.error === 'function') {
	    console.error(message);
	  }
	  /* eslint-enable no-console */
	  try {
	    // This error was thrown as a convenience so that if you enable
	    // "break on all exceptions" in your console,
	    // it would pause the execution at this line.
	    throw new Error(message);
	  } catch (e) {} // eslint-disable-line no-empty
	}

	/**
	 * Composes single-argument functions from right to left. The rightmost
	 * function can take multiple arguments as it provides the signature for
	 * the resulting composite function.
	 *
	 * @param {...Function} funcs The functions to compose.
	 * @returns {Function} A function obtained by composing the argument functions
	 * from right to left. For example, compose(f, g, h) is identical to doing
	 * (...args) => f(g(h(...args))).
	 */

	function compose() {
	  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
	    funcs[_key] = arguments[_key];
	  }

	  if (funcs.length === 0) {
	    return function (arg) {
	      return arg;
	    };
	  }

	  if (funcs.length === 1) {
	    return funcs[0];
	  }

	  return funcs.reduce(function (a, b) {
	    return function () {
	      return a(b.apply(undefined, arguments));
	    };
	  });
	}

	/**
	 * Creates a store enhancer that applies middleware to the dispatch method
	 * of the Redux store. This is handy for a variety of tasks, such as expressing
	 * asynchronous actions in a concise manner, or logging every action payload.
	 *
	 * See `redux-thunk` package as an example of the Redux middleware.
	 *
	 * Because middleware is potentially asynchronous, this should be the first
	 * store enhancer in the composition chain.
	 *
	 * Note that each middleware will be given the `dispatch` and `getState` functions
	 * as named arguments.
	 *
	 * @param {...Function} middlewares The middleware chain to be applied.
	 * @returns {Function} A store enhancer applying the middleware.
	 */
	function applyMiddleware() {
	  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
	    middlewares[_key] = arguments[_key];
	  }

	  return function (createStore) {
	    return function () {
	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }

	      var store = createStore.apply(undefined, args);
	      var _dispatch = function dispatch() {
	        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
	      };

	      var middlewareAPI = {
	        getState: store.getState,
	        dispatch: function dispatch() {
	          return _dispatch.apply(undefined, arguments);
	        }
	      };
	      var chain = middlewares.map(function (middleware) {
	        return middleware(middlewareAPI);
	      });
	      _dispatch = compose.apply(undefined, chain)(store.dispatch);

	      return _extends({}, store, {
	        dispatch: _dispatch
	      });
	    };
	  };
	}

	/*
	 * This is a dummy function to check if the function name has been altered by minification.
	 * If the function has been minified and NODE_ENV !== 'production', warn the user.
	 */
	function isCrushed() {}

	if (typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
	  warning("You are currently using minified code outside of NODE_ENV === 'production'. " + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
	}

	var createName = function createName(name) {
	  return "@@redux-saga/" + name;
	};

	var createSymbol = function createSymbol(id) {
	  id = createName(id);
	  return typeof Symbol === 'function' ? Symbol(id) : id;
	};

	var createGlobalSymbol = function createGlobalSymbol(id) {
	  id = createName(id);
	  return typeof Symbol === 'function' && typeof Symbol.for === 'function' ? Symbol.for(id) : id;
	};

	var CANCEL =
	/*#__PURE__*/
	createSymbol('CANCEL_PROMISE');
	var CHANNEL_END =
	/*#__PURE__*/
	createSymbol('CHANNEL_END');
	var CHANNEL_END_TYPE =
	/*#__PURE__*/
	createSymbol('CHANNEL_END');
	var IO =
	/*#__PURE__*/
	createSymbol('IO');
	var MATCH =
	/*#__PURE__*/
	createSymbol('MATCH');
	var MULTICAST =
	/*#__PURE__*/
	createSymbol('MULTICAST');
	var SAGA_ACTION =
	/*#__PURE__*/
	createSymbol('SAGA_ACTION');
	var SELF_CANCELLATION =
	/*#__PURE__*/
	createSymbol('SELF_CANCELLATION');
	var TASK =
	/*#__PURE__*/
	createSymbol('TASK');
	var TASK_CANCEL =
	/*#__PURE__*/
	createSymbol('TASK_CANCEL');
	var SAGA_LOCATION =
	/*#__PURE__*/
	createGlobalSymbol('LOCATION');

	function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
	var konst = function konst(v) {
	  return function () {
	    return v;
	  };
	};
	var kTrue =
	/*#__PURE__*/
	konst(true);
	var noop = function noop() {};
	var identity = function identity(v) {
	  return v;
	};
	function check(value, predicate, error) {
	  if (!predicate(value)) {
	    throw new Error(error);
	  }
	}
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function hasOwn(object, property) {
	  return is.notUndef(object) && hasOwnProperty.call(object, property);
	}
	var is = {
	  undef: function undef(v) {
	    return v === null || v === undefined;
	  },
	  notUndef: function notUndef(v) {
	    return v !== null && v !== undefined;
	  },
	  func: function func(f) {
	    return typeof f === 'function';
	  },
	  number: function number(n) {
	    return typeof n === 'number';
	  },
	  string: function string(s) {
	    return typeof s === 'string';
	  },
	  array: Array.isArray,
	  object: function object(obj) {
	    return obj && !is.array(obj) && typeof obj === 'object';
	  },
	  promise: function promise(p) {
	    return p && is.func(p.then);
	  },
	  iterator: function iterator(it) {
	    return it && is.func(it.next) && is.func(it.throw);
	  },
	  iterable: function iterable(it) {
	    return it && is.func(Symbol) ? is.func(it[Symbol.iterator]) : is.array(it);
	  },
	  task: function task(t) {
	    return t && t[TASK];
	  },
	  observable: function observable(ob) {
	    return ob && is.func(ob.subscribe);
	  },
	  buffer: function buffer(buf) {
	    return buf && is.func(buf.isEmpty) && is.func(buf.take) && is.func(buf.put);
	  },
	  pattern: function pattern(pat) {
	    return pat && (is.string(pat) || is.symbol(pat) || is.func(pat) || is.array(pat));
	  },
	  channel: function channel(ch) {
	    return ch && is.func(ch.take) && is.func(ch.close);
	  },
	  stringableFunc: function stringableFunc(f) {
	    return is.func(f) && hasOwn(f, 'toString');
	  },
	  symbol: function symbol(sym) {
	    return Boolean(sym) && typeof Symbol === 'function' && sym.constructor === Symbol && sym !== Symbol.prototype;
	  },
	  multicast: function multicast(ch) {
	    return is.channel(ch) && ch[MULTICAST];
	  }
	};
	var object = {
	  assign: function assign(target, source) {
	    for (var i in source) {
	      if (hasOwn(source, i)) {
	        target[i] = source[i];
	      }
	    }
	  }
	};
	function remove(array, item) {
	  var index = array.indexOf(item);

	  if (index >= 0) {
	    array.splice(index, 1);
	  }
	}
	var array = {
	  from: function from(obj) {
	    var arr = Array(obj.length);

	    for (var i in obj) {
	      if (hasOwn(obj, i)) {
	        arr[i] = obj[i];
	      }
	    }

	    return arr;
	  }
	};
	function once(fn) {
	  var called = false;
	  return function () {
	    if (called) {
	      return;
	    }

	    called = true;
	    fn();
	  };
	}
	function deferred(props) {
	  if (props === void 0) {
	    props = {};
	  }

	  var def = _extends$1({}, props);

	  var promise = new Promise(function (resolve, reject) {
	    def.resolve = resolve;
	    def.reject = reject;
	  });
	  def.promise = promise;
	  return def;
	}
	function delay(ms, val) {
	  if (val === void 0) {
	    val = true;
	  }

	  var timeoutId;
	  var promise = new Promise(function (resolve) {
	    timeoutId = setTimeout(function () {
	      return resolve(val);
	    }, ms);
	  });

	  promise[CANCEL] = function () {
	    return clearTimeout(timeoutId);
	  };

	  return promise;
	}
	function autoInc(seed) {
	  if (seed === void 0) {
	    seed = 0;
	  }

	  return function () {
	    return ++seed;
	  };
	}
	var uid =
	/*#__PURE__*/
	autoInc();

	var kThrow = function kThrow(err) {
	  throw err;
	};

	var kReturn = function kReturn(value) {
	  return {
	    value: value,
	    done: true
	  };
	};

	function makeIterator(next, thro, name) {
	  if (thro === void 0) {
	    thro = kThrow;
	  }

	  if (name === void 0) {
	    name = 'iterator';
	  }

	  var iterator = {
	    meta: {
	      name: name
	    },
	    next: next,
	    throw: thro,
	    return: kReturn,
	    isSagaIterator: true
	  };

	  if (typeof Symbol !== 'undefined') {
	    iterator[Symbol.iterator] = function () {
	      return iterator;
	    };
	  }

	  return iterator;
	}
	/**
	  Print error in a useful way whether in a browser environment
	  (with expandable error stack traces), or in a node.js environment
	  (text-only log output)
	 **/

	function log(level, message, error) {
	  if (error === void 0) {
	    error = '';
	  }

	  /*eslint-disable no-console*/
	  if (typeof window === 'undefined') {
	    console.log("redux-saga " + level + ": " + message + "\n" + (error && error.stack || error));
	  } else {
	    console[level](message, error);
	  }
	}
	var internalErr = function internalErr(err) {
	  return new Error("\n  redux-saga: Error checking hooks detected an inconsistent state. This is likely a bug\n  in redux-saga code and not yours. Thanks for reporting this in the project's github repo.\n  Error: " + err + "\n");
	};
	var createSetContextWarning = function createSetContextWarning(ctx, props) {
	  return (ctx ? ctx + '.' : '') + "setContext(props): argument " + props + " is not a plain object";
	};
	var wrapSagaDispatch = function wrapSagaDispatch(dispatch) {
	  return function (action) {
	    return dispatch(Object.defineProperty(action, SAGA_ACTION, {
	      value: true
	    }));
	  };
	};

	var BUFFER_OVERFLOW = "Channel's Buffer overflow!";
	var ON_OVERFLOW_THROW = 1;
	var ON_OVERFLOW_SLIDE = 3;
	var ON_OVERFLOW_EXPAND = 4;
	var zeroBuffer = {
	  isEmpty: kTrue,
	  put: noop,
	  take: noop
	};

	function ringBuffer(limit, overflowAction) {
	  if (limit === void 0) {
	    limit = 10;
	  }

	  var arr = new Array(limit);
	  var length = 0;
	  var pushIndex = 0;
	  var popIndex = 0;

	  var push = function push(it) {
	    arr[pushIndex] = it;
	    pushIndex = (pushIndex + 1) % limit;
	    length++;
	  };

	  var take = function take() {
	    if (length != 0) {
	      var it = arr[popIndex];
	      arr[popIndex] = null;
	      length--;
	      popIndex = (popIndex + 1) % limit;
	      return it;
	    }
	  };

	  var flush = function flush() {
	    var items = [];

	    while (length) {
	      items.push(take());
	    }

	    return items;
	  };

	  return {
	    isEmpty: function isEmpty() {
	      return length == 0;
	    },
	    put: function put(it) {
	      if (length < limit) {
	        push(it);
	      } else {
	        var doubledLimit;

	        switch (overflowAction) {
	          case ON_OVERFLOW_THROW:
	            throw new Error(BUFFER_OVERFLOW);

	          case ON_OVERFLOW_SLIDE:
	            arr[pushIndex] = it;
	            pushIndex = (pushIndex + 1) % limit;
	            popIndex = pushIndex;
	            break;

	          case ON_OVERFLOW_EXPAND:
	            doubledLimit = 2 * limit;
	            arr = flush();
	            length = arr.length;
	            pushIndex = arr.length;
	            popIndex = 0;
	            arr.length = doubledLimit;
	            limit = doubledLimit;
	            push(it);
	            break;

	          default: // DROP

	        }
	      }
	    },
	    take: take,
	    flush: flush
	  };
	}

	var none = function none() {
	  return zeroBuffer;
	};
	var sliding = function sliding(limit) {
	  return ringBuffer(limit, ON_OVERFLOW_SLIDE);
	};
	var expanding = function expanding(initialSize) {
	  return ringBuffer(initialSize, ON_OVERFLOW_EXPAND);
	};

	var queue = [];
	/**
	  Variable to hold a counting semaphore
	  - Incrementing adds a lock and puts the scheduler in a `suspended` state (if it's not
	    already suspended)
	  - Decrementing releases a lock. Zero locks puts the scheduler in a `released` state. This
	    triggers flushing the queued tasks.
	**/

	var semaphore = 0;
	/**
	  Executes a task 'atomically'. Tasks scheduled during this execution will be queued
	  and flushed after this task has finished (assuming the scheduler endup in a released
	  state).
	**/

	function exec(task) {
	  try {
	    suspend();
	    task();
	  } finally {
	    release();
	  }
	}
	/**
	  Executes or queues a task depending on the state of the scheduler (`suspended` or `released`)
	**/


	function asap(task) {
	  queue.push(task);

	  if (!semaphore) {
	    suspend();
	    flush();
	  }
	}
	/**
	  Puts the scheduler in a `suspended` state. Scheduled tasks will be queued until the
	  scheduler is released.
	**/

	function suspend() {
	  semaphore++;
	}
	/**
	  Puts the scheduler in a `released` state.
	**/

	function release() {
	  semaphore--;
	}
	/**
	  Releases the current lock. Executes all queued tasks if the scheduler is in the released state.
	**/


	function flush() {
	  release();
	  var task;

	  while (!semaphore && (task = queue.shift()) !== undefined) {
	    exec(task);
	  }
	}

	var array$1 = function array$$1(patterns) {
	  return function (input) {
	    return patterns.some(function (p) {
	      return matcher(p)(input);
	    });
	  };
	};
	var predicate = function predicate(_predicate) {
	  return function (input) {
	    return _predicate(input);
	  };
	};
	var string = function string(pattern) {
	  return function (input) {
	    return input.type === String(pattern);
	  };
	};
	var symbol = function symbol(pattern) {
	  return function (input) {
	    return input.type === pattern;
	  };
	};
	var wildcard = function wildcard() {
	  return kTrue;
	};
	function matcher(pattern) {
	  // prettier-ignore
	  var matcherCreator = pattern === '*' ? wildcard : is.string(pattern) ? string : is.array(pattern) ? array$1 : is.stringableFunc(pattern) ? string : is.func(pattern) ? predicate : is.symbol(pattern) ? symbol : null;

	  if (matcherCreator === null) {
	    throw new Error("invalid pattern: " + pattern);
	  }

	  return matcherCreator(pattern);
	}

	var END = {
	  type: CHANNEL_END_TYPE
	};
	var isEnd = function isEnd(a) {
	  return a && a.type === CHANNEL_END_TYPE;
	};
	var INVALID_BUFFER = 'invalid buffer passed to channel factory function';
	var UNDEFINED_INPUT_ERROR = "Saga or channel was provided with an undefined action\nHints:\n  - check that your Action Creator returns a non-undefined value\n  - if the Saga was started using runSaga, check that your subscribe source provides the action to its listeners";
	function channel(buffer) {
	  if (buffer === void 0) {
	    buffer = expanding();
	  }

	  var closed = false;
	  var takers = [];

	  {
	    check(buffer, is.buffer, INVALID_BUFFER);
	  }

	  function checkForbiddenStates() {
	    if (closed && takers.length) {
	      throw internalErr('Cannot have a closed channel with pending takers');
	    }

	    if (takers.length && !buffer.isEmpty()) {
	      throw internalErr('Cannot have pending takers with non empty buffer');
	    }
	  }

	  function put(input) {
	    checkForbiddenStates();

	    {
	      check(input, is.notUndef, UNDEFINED_INPUT_ERROR);
	    }

	    if (closed) {
	      return;
	    }

	    if (!takers.length) {
	      return buffer.put(input);
	    }

	    var cb = takers[0];
	    takers.splice(0, 1);
	    cb(input);
	  }

	  function take(cb) {
	    checkForbiddenStates();

	    {
	      check(cb, is.func, "channel.take's callback must be a function");
	    }

	    if (closed && buffer.isEmpty()) {
	      cb(END);
	    } else if (!buffer.isEmpty()) {
	      cb(buffer.take());
	    } else {
	      takers.push(cb);

	      cb.cancel = function () {
	        return remove(takers, cb);
	      };
	    }
	  }

	  function flush$$1(cb) {
	    checkForbiddenStates(); // TODO: check if some new state should be forbidden now

	    {
	      check(cb, is.func, "channel.flush' callback must be a function");
	    }

	    if (closed && buffer.isEmpty()) {
	      cb(END);
	      return;
	    }

	    cb(buffer.flush());
	  }

	  function close() {
	    checkForbiddenStates();

	    if (!closed) {
	      closed = true;

	      if (takers.length) {
	        var arr = takers;
	        takers = [];

	        for (var i = 0, len = arr.length; i < len; i++) {
	          var taker = arr[i];
	          taker(END);
	        }
	      }
	    }
	  }

	  return {
	    take: take,
	    put: put,
	    flush: flush$$1,
	    close: close
	  };
	}
	function eventChannel(subscribe, buffer) {
	  if (buffer === void 0) {
	    buffer = none();
	  }

	  var closed = false;
	  var unsubscribe;
	  var chan = channel(buffer);

	  var close = function close() {
	    if (is.func(unsubscribe)) {
	      unsubscribe();
	    }

	    chan.close();
	  };

	  unsubscribe = subscribe(function (input) {
	    if (isEnd(input)) {
	      close();
	      closed = true;
	      return;
	    }

	    chan.put(input);
	  });

	  if (!is.func(unsubscribe)) {
	    throw new Error('in eventChannel: subscribe should return a function to unsubscribe');
	  }

	  unsubscribe = once(unsubscribe);

	  if (closed) {
	    unsubscribe();
	  }

	  return {
	    take: chan.take,
	    flush: chan.flush,
	    close: close
	  };
	}
	function multicastChannel() {
	  var _ref;

	  var closed = false;
	  var currentTakers = [];
	  var nextTakers = currentTakers;

	  var ensureCanMutateNextTakers = function ensureCanMutateNextTakers() {
	    if (nextTakers !== currentTakers) {
	      return;
	    }

	    nextTakers = currentTakers.slice();
	  }; // TODO: check if its possible to extract closing function and reuse it in both unicasts and multicasts


	  var close = function close() {
	    closed = true;
	    var takers = currentTakers = nextTakers;

	    for (var i = 0; i < takers.length; i++) {
	      var taker = takers[i];
	      taker(END);
	    }

	    nextTakers = [];
	  };

	  return _ref = {}, _ref[MULTICAST] = true, _ref.put = function put(input) {
	    // TODO: should I check forbidden state here? 1 of them is even impossible
	    // as we do not possibility of buffer here
	    {
	      check(input, is.notUndef, UNDEFINED_INPUT_ERROR);
	    }

	    if (closed) {
	      return;
	    }

	    if (isEnd(input)) {
	      close();
	      return;
	    }

	    var takers = currentTakers = nextTakers;

	    for (var i = 0; i < takers.length; i++) {
	      var taker = takers[i];

	      if (taker[MATCH](input)) {
	        taker.cancel();
	        taker(input);
	      }
	    }
	  }, _ref.take = function take(cb, matcher$$1) {
	    if (matcher$$1 === void 0) {
	      matcher$$1 = wildcard;
	    }

	    if (closed) {
	      cb(END);
	      return;
	    }

	    cb[MATCH] = matcher$$1;
	    ensureCanMutateNextTakers();
	    nextTakers.push(cb);
	    cb.cancel = once(function () {
	      ensureCanMutateNextTakers();
	      remove(nextTakers, cb);
	    });
	  }, _ref.close = close, _ref;
	}
	function stdChannel() {
	  var chan = multicastChannel();
	  var put = chan.put;

	  chan.put = function (input) {
	    if (input[SAGA_ACTION]) {
	      put(input);
	      return;
	    }

	    asap(function () {
	      return put(input);
	    });
	  };

	  return chan;
	}

	function formatLocation(fileName, lineNumber) {
	  return fileName + "?" + lineNumber;
	}

	function getLocation(instrumented) {
	  return instrumented[SAGA_LOCATION];
	}

	function effectLocationAsString(effect) {
	  var location = getLocation(effect);

	  if (location) {
	    var code = location.code,
	        fileName = location.fileName,
	        lineNumber = location.lineNumber;
	    var source = code + "  " + formatLocation(fileName, lineNumber);
	    return source;
	  }

	  return '';
	}

	function sagaLocationAsString(sagaMeta) {
	  var name = sagaMeta.name,
	      location = sagaMeta.location;

	  if (location) {
	    return name + "  " + formatLocation(location.fileName, location.lineNumber);
	  }

	  return name;
	}

	var flatMap = function flatMap(arr, getter) {
	  if (getter === void 0) {
	    getter = function getter(f) {
	      return f;
	    };
	  }

	  return arr.reduce(function (acc, i) {
	    return acc.concat(getter(i));
	  }, []);
	};

	function cancelledTasksAsString(sagaStack) {
	  var cancelledTasks = flatMap(sagaStack, function (i) {
	    return i.cancelledTasks;
	  });

	  if (!cancelledTasks.length) {
	    return '';
	  }

	  return ['Tasks cancelled due to error:'].concat(cancelledTasks).join('\n');
	}
	/**
	    @param {saga, effect}[] sagaStack
	    @returns {string}

	    @example
	    The above error occurred in task errorInPutSaga {pathToFile}
	    when executing effect put({type: 'REDUCER_ACTION_ERROR_IN_PUT'}) {pathToFile}
	        created by fetchSaga {pathToFile}
	        created by rootSaga {pathToFile}
	*/


	function sagaStackToString(sagaStack) {
	  var firstSaga = sagaStack[0],
	      otherSagas = sagaStack.slice(1);
	  var crashedEffectLocation = firstSaga.effect ? effectLocationAsString(firstSaga.effect) : null;
	  var errorMessage = "The above error occurred in task " + sagaLocationAsString(firstSaga.meta) + (crashedEffectLocation ? " \n when executing effect " + crashedEffectLocation : '');
	  return [errorMessage].concat(otherSagas.map(function (s) {
	    return "    created by " + sagaLocationAsString(s.meta);
	  }), [cancelledTasksAsString(sagaStack)]).join('\n');
	}
	function addSagaStack(errorObject, errorStack) {
	  if (typeof errorObject === 'object') {
	    if (typeof errorObject.sagaStack === 'undefined') {
	      // property is used as a stack of descriptors for failed sagas
	      // after formatting to string it will be re-written
	      // to pass sagaStack as a string in user land
	      Object.defineProperty(errorObject, 'sagaStack', {
	        value: [],
	        writable: true,
	        enumerable: false
	      });
	    }

	    errorObject.sagaStack.push(errorStack);
	  }
	}

	var done = {
	  done: true,
	  value: undefined
	};
	var qEnd = {};
	function safeName(patternOrChannel) {
	  if (is.channel(patternOrChannel)) {
	    return 'channel';
	  }

	  if (is.stringableFunc(patternOrChannel)) {
	    return String(patternOrChannel);
	  }

	  if (is.func(patternOrChannel)) {
	    return patternOrChannel.name;
	  }

	  return String(patternOrChannel);
	}
	function fsmIterator(fsm, q0, name) {
	  var updateState,
	      qNext = q0;

	  function next(arg, error) {
	    if (qNext === qEnd) {
	      return done;
	    }

	    if (error) {
	      qNext = qEnd;
	      throw error;
	    } else {
	      updateState && updateState(arg);

	      var _fsm$qNext = fsm[qNext](),
	          q = _fsm$qNext[0],
	          output = _fsm$qNext[1],
	          _updateState = _fsm$qNext[2];

	      qNext = q;
	      updateState = _updateState;
	      return qNext === qEnd ? done : output;
	    }
	  }

	  return makeIterator(next, function (error) {
	    return next(null, error);
	  }, name);
	}

	function takeEvery(patternOrChannel, worker) {
	  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  var yTake = {
	    done: false,
	    value: take(patternOrChannel)
	  };

	  var yFork = function yFork(ac) {
	    return {
	      done: false,
	      value: fork.apply(void 0, [worker].concat(args, [ac]))
	    };
	  };

	  var action,
	      setAction = function setAction(ac) {
	    return action = ac;
	  };

	  return fsmIterator({
	    q1: function q1() {
	      return ['q2', yTake, setAction];
	    },
	    q2: function q2() {
	      return action === END ? [qEnd] : ['q1', yFork(action)];
	    }
	  }, 'q1', "takeEvery(" + safeName(patternOrChannel) + ", " + worker.name + ")");
	}

	var TAKE = 'TAKE';
	var PUT = 'PUT';
	var ALL = 'ALL';
	var RACE = 'RACE';
	var CALL = 'CALL';
	var CPS = 'CPS';
	var FORK = 'FORK';
	var JOIN = 'JOIN';
	var CANCEL$1 = 'CANCEL';
	var SELECT = 'SELECT';
	var ACTION_CHANNEL = 'ACTION_CHANNEL';
	var CANCELLED = 'CANCELLED';
	var FLUSH = 'FLUSH';
	var GET_CONTEXT = 'GET_CONTEXT';
	var SET_CONTEXT = 'SET_CONTEXT';
	var TEST_HINT = '\n(HINT: if you are getting this errors in tests, consider using createMockTask from redux-saga/utils)';

	var effect = function effect(type, payload) {
	  var _ref;

	  return _ref = {}, _ref[IO] = true, _ref[type] = payload, _ref;
	};
	function take(patternOrChannel, multicastPattern) {
	  if (patternOrChannel === void 0) {
	    patternOrChannel = '*';
	  }

	  if (arguments.length) {
	    check(arguments[0], is.notUndef, 'take(patternOrChannel): patternOrChannel is undefined');
	  }

	  if (is.pattern(patternOrChannel)) {
	    return effect(TAKE, {
	      pattern: patternOrChannel
	    });
	  }

	  if (is.multicast(patternOrChannel) && is.notUndef(multicastPattern) && is.pattern(multicastPattern)) {
	    return effect(TAKE, {
	      channel: patternOrChannel,
	      pattern: multicastPattern
	    });
	  }

	  if (is.channel(patternOrChannel)) {
	    return effect(TAKE, {
	      channel: patternOrChannel
	    });
	  }

	  throw new Error("take(patternOrChannel): argument " + patternOrChannel + " is not valid channel or a valid pattern");
	}
	function put(channel, action) {
	  {
	    if (arguments.length > 1) {
	      check(channel, is.notUndef, 'put(channel, action): argument channel is undefined');
	      check(channel, is.channel, "put(channel, action): argument " + channel + " is not a valid channel");
	      check(action, is.notUndef, 'put(channel, action): argument action is undefined');
	    } else {
	      check(channel, is.notUndef, 'put(action): argument action is undefined');
	    }
	  }

	  if (is.undef(action)) {
	    action = channel;
	    channel = null;
	  }

	  return effect(PUT, {
	    channel: channel,
	    action: action
	  });
	}
	function all(effects) {
	  return effect(ALL, effects);
	}

	function getFnCallDesc(meth, fn, args) {
	  {
	    check(fn, is.notUndef, meth + ": argument fn is undefined");
	  }

	  var context = null;

	  if (is.array(fn)) {
	    var _fn = fn;
	    context = _fn[0];
	    fn = _fn[1];
	  } else if (fn.fn) {
	    var _fn2 = fn;
	    context = _fn2.context;
	    fn = _fn2.fn;
	  }

	  if (context && is.string(fn) && is.func(context[fn])) {
	    fn = context[fn];
	  }

	  {
	    check(fn, is.func, meth + ": argument " + fn + " is not a function");
	  }

	  return {
	    context: context,
	    fn: fn,
	    args: args
	  };
	}

	function call(fn) {
	  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  return effect(CALL, getFnCallDesc('call', fn, args));
	}
	function fork(fn) {
	  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	    args[_key3 - 1] = arguments[_key3];
	  }

	  return effect(FORK, getFnCallDesc('fork', fn, args));
	}
	function cancel$1() {
	  for (var _len6 = arguments.length, tasks = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
	    tasks[_key6] = arguments[_key6];
	  }

	  if (tasks.length > 1) {
	    return all(tasks.map(function (t) {
	      return cancel$1(t);
	    }));
	  }

	  var task = tasks[0];

	  if (tasks.length === 1) {
	    check(task, is.notUndef, 'cancel(task): argument task is undefined');
	    check(task, is.task, "cancel(task): argument " + task + " is not a valid Task object " + TEST_HINT);
	  }

	  return effect(CANCEL$1, task || SELF_CANCELLATION);
	}
	function select(selector) {
	  if (selector === void 0) {
	    selector = identity;
	  }

	  for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
	    args[_key7 - 1] = arguments[_key7];
	  }

	  if (arguments.length) {
	    check(arguments[0], is.notUndef, 'select(selector, [...]): argument selector is undefined');
	    check(selector, is.func, "select(selector, [...]): argument " + selector + " is not a function");
	  }

	  return effect(SELECT, {
	    selector: selector,
	    args: args
	  });
	}
	function cancelled() {
	  return effect(CANCELLED, {});
	}
	function takeEvery$1(patternOrChannel, worker) {
	  for (var _len8 = arguments.length, args = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
	    args[_key8 - 2] = arguments[_key8];
	  }

	  return fork.apply(void 0, [takeEvery, patternOrChannel, worker].concat(args));
	}
	var delay$1 =
	/*#__PURE__*/
	call.bind(null, delay);

	var createAsEffectType = function createAsEffectType(type) {
	  return function (effect) {
	    return effect && effect[IO] && effect[type];
	  };
	};

	var asEffect = {
	  take:
	  /*#__PURE__*/
	  createAsEffectType(TAKE),
	  put:
	  /*#__PURE__*/
	  createAsEffectType(PUT),
	  all:
	  /*#__PURE__*/
	  createAsEffectType(ALL),
	  race:
	  /*#__PURE__*/
	  createAsEffectType(RACE),
	  call:
	  /*#__PURE__*/
	  createAsEffectType(CALL),
	  cps:
	  /*#__PURE__*/
	  createAsEffectType(CPS),
	  fork:
	  /*#__PURE__*/
	  createAsEffectType(FORK),
	  join:
	  /*#__PURE__*/
	  createAsEffectType(JOIN),
	  cancel:
	  /*#__PURE__*/
	  createAsEffectType(CANCEL$1),
	  select:
	  /*#__PURE__*/
	  createAsEffectType(SELECT),
	  actionChannel:
	  /*#__PURE__*/
	  createAsEffectType(ACTION_CHANNEL),
	  cancelled:
	  /*#__PURE__*/
	  createAsEffectType(CANCELLED),
	  flush:
	  /*#__PURE__*/
	  createAsEffectType(FLUSH),
	  getContext:
	  /*#__PURE__*/
	  createAsEffectType(GET_CONTEXT),
	  setContext:
	  /*#__PURE__*/
	  createAsEffectType(SET_CONTEXT)
	};

	function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
	function getMetaInfo(fn) {
	  return {
	    name: fn.name || 'anonymous',
	    location: getLocation(fn)
	  };
	}

	function getIteratorMetaInfo(iterator, fn) {
	  if (iterator.isSagaIterator) {
	    return {
	      name: iterator.meta.name
	    };
	  }

	  return getMetaInfo(fn);
	} // TODO: check if this hacky toString stuff is needed
	// also check again whats the difference between CHANNEL_END and CHANNEL_END_TYPE
	// maybe this could become MAYBE_END
	// I guess this gets exported so takeMaybe result can be checked


	var CHANNEL_END$1 = {
	  toString: function toString() {
	    return CHANNEL_END;
	  }
	};
	var TASK_CANCEL$1 = {
	  toString: function toString() {
	    return TASK_CANCEL;
	  }
	};
	/**
	  Used to track a parent task and its forks
	  In the new fork model, forked tasks are attached by default to their parent
	  We model this using the concept of Parent task && main Task
	  main task is the main flow of the current Generator, the parent tasks is the
	  aggregation of the main tasks + all its forked tasks.
	  Thus the whole model represents an execution tree with multiple branches (vs the
	  linear execution tree in sequential (non parallel) programming)

	  A parent tasks has the following semantics
	  - It completes if all its forks either complete or all cancelled
	  - If it's cancelled, all forks are cancelled as well
	  - It aborts if any uncaught error bubbles up from forks
	  - If it completes, the return value is the one returned by the main task
	**/

	function forkQueue(mainTask, onAbort, cb) {
	  var tasks = [],
	      result,
	      completed = false;
	  addTask(mainTask);

	  var getTasks = function getTasks() {
	    return tasks;
	  };

	  var getTaskNames = function getTaskNames() {
	    return tasks.map(function (t) {
	      return t.meta.name;
	    });
	  };

	  function abort(err) {
	    onAbort();
	    cancelAll();
	    cb(err, true);
	  }

	  function addTask(task) {
	    tasks.push(task);

	    task.cont = function (res, isErr) {
	      if (completed) {
	        return;
	      }

	      remove(tasks, task);
	      task.cont = noop;

	      if (isErr) {
	        abort(res);
	      } else {
	        if (task === mainTask) {
	          result = res;
	        }

	        if (!tasks.length) {
	          completed = true;
	          cb(result);
	        }
	      }
	    }; // task.cont.cancel = task.cancel

	  }

	  function cancelAll() {
	    if (completed) {
	      return;
	    }

	    completed = true;
	    tasks.forEach(function (t) {
	      t.cont = noop;
	      t.cancel();
	    });
	    tasks = [];
	  }

	  return {
	    addTask: addTask,
	    cancelAll: cancelAll,
	    abort: abort,
	    getTasks: getTasks,
	    getTaskNames: getTaskNames
	  };
	}

	function createTaskIterator(_ref) {
	  var context = _ref.context,
	      fn = _ref.fn,
	      args = _ref.args;

	  if (is.iterator(fn)) {
	    return fn;
	  } // catch synchronous failures; see #152 and #441


	  var result, error;

	  try {
	    result = fn.apply(context, args);
	  } catch (err) {
	    error = err;
	  } // i.e. a generator function returns an iterator


	  if (is.iterator(result)) {
	    return result;
	  } // do not bubble up synchronous failures for detached forks
	  // instead create a failed task. See #152 and #441


	  return error ? makeIterator(function () {
	    throw error;
	  }) : makeIterator(function () {
	    var pc;
	    var eff = {
	      done: false,
	      value: result
	    };

	    var ret = function ret(value) {
	      return {
	        done: true,
	        value: value
	      };
	    };

	    return function (arg) {
	      if (!pc) {
	        pc = true;
	        return eff;
	      } else {
	        return ret(arg);
	      }
	    };
	  }());
	}

	function proc(iterator, stdChannel$$1, dispatch, getState, parentContext, options, parentEffectId, meta, cont) {
	  if (dispatch === void 0) {
	    dispatch = noop;
	  }

	  if (getState === void 0) {
	    getState = noop;
	  }

	  if (parentContext === void 0) {
	    parentContext = {};
	  }

	  if (options === void 0) {
	    options = {};
	  }

	  if (parentEffectId === void 0) {
	    parentEffectId = 0;
	  }

	  var _options = options,
	      sagaMonitor = _options.sagaMonitor,
	      logger = _options.logger,
	      onError = _options.onError,
	      middleware = _options.middleware;
	  var log$$1 = logger || log;

	  var logError = function logError(err) {
	    log$$1('error', err);

	    if (err.sagaStack) {
	      log$$1('error', err.sagaStack);
	    }
	  };

	  var taskContext = Object.create(parentContext);
	  var crashedEffect = null;
	  var cancelledDueToErrorTasks = [];
	  /**
	    Tracks the current effect cancellation
	    Each time the generator progresses. calling runEffect will set a new value
	    on it. It allows propagating cancellation to child effects
	  **/

	  next.cancel = noop;
	  /**
	    Creates a new task descriptor for this generator, We'll also create a main task
	    to track the main flow (besides other forked tasks)
	  **/

	  var task = newTask(parentEffectId, meta, iterator, cont);
	  var mainTask = {
	    meta: meta,
	    cancel: cancelMain,
	    isRunning: true
	  };
	  var taskQueue = forkQueue(mainTask, function onAbort() {
	    cancelledDueToErrorTasks.push.apply(cancelledDueToErrorTasks, taskQueue.getTaskNames());
	  }, end);
	  /**
	    cancellation of the main task. We'll simply resume the Generator with a Cancel
	  **/

	  function cancelMain() {
	    if (mainTask.isRunning && !mainTask.isCancelled) {
	      mainTask.isCancelled = true;
	      next(TASK_CANCEL$1);
	    }
	  }
	  /**
	    This may be called by a parent generator to trigger/propagate cancellation
	    cancel all pending tasks (including the main task), then end the current task.
	     Cancellation propagates down to the whole execution tree holded by this Parent task
	    It's also propagated to all joiners of this task and their execution tree/joiners
	     Cancellation is noop for terminated/Cancelled tasks tasks
	  **/


	  function cancel() {
	    /**
	      We need to check both Running and Cancelled status
	      Tasks can be Cancelled but still Running
	    **/
	    if (iterator._isRunning && !iterator._isCancelled) {
	      iterator._isCancelled = true;
	      taskQueue.cancelAll();
	      /**
	        Ending with a Never result will propagate the Cancellation to all joiners
	      **/

	      end(TASK_CANCEL$1);
	    }
	  }
	  /**
	    attaches cancellation logic to this task's continuation
	    this will permit cancellation to propagate down the call chain
	  **/


	  cont && (cont.cancel = cancel); // tracks the running status

	  iterator._isRunning = true; // kicks up the generator

	  next(); // then return the task descriptor to the caller

	  return task;
	  /**
	    This is the generator driver
	    It's a recursive async/continuation function which calls itself
	    until the generator terminates or throws
	  **/

	  function next(arg, isErr) {
	    // Preventive measure. If we end up here, then there is really something wrong
	    if (!mainTask.isRunning) {
	      throw new Error('Trying to resume an already finished generator');
	    }

	    try {
	      var result;

	      if (isErr) {
	        result = iterator.throw(arg);
	      } else if (arg === TASK_CANCEL$1) {
	        /**
	          getting TASK_CANCEL automatically cancels the main task
	          We can get this value here
	           - By cancelling the parent task manually
	          - By joining a Cancelled task
	        **/
	        mainTask.isCancelled = true;
	        /**
	          Cancels the current effect; this will propagate the cancellation down to any called tasks
	        **/

	        next.cancel();
	        /**
	          If this Generator has a `return` method then invokes it
	          This will jump to the finally block
	        **/

	        result = is.func(iterator.return) ? iterator.return(TASK_CANCEL$1) : {
	          done: true,
	          value: TASK_CANCEL$1
	        };
	      } else if (arg === CHANNEL_END$1) {
	        // We get CHANNEL_END by taking from a channel that ended using `take` (and not `takem` used to trap End of channels)
	        result = is.func(iterator.return) ? iterator.return() : {
	          done: true
	        };
	      } else {
	        result = iterator.next(arg);
	      }

	      if (!result.done) {
	        digestEffect(result.value, parentEffectId, '', next);
	      } else {
	        /**
	          This Generator has ended, terminate the main task and notify the fork queue
	        **/
	        mainTask.isMainRunning = false;
	        mainTask.cont && mainTask.cont(result.value);
	      }
	    } catch (error) {
	      if (mainTask.isCancelled) {
	        logError(error);
	      }

	      mainTask.isMainRunning = false;
	      mainTask.cont(error, true);
	    }
	  }

	  function end(result, isErr) {
	    iterator._isRunning = false; // stdChannel.close()

	    if (!isErr) {
	      iterator._result = result;
	      iterator._deferredEnd && iterator._deferredEnd.resolve(result);
	    } else {
	      addSagaStack(result, {
	        meta: meta,
	        effect: crashedEffect,
	        cancelledTasks: cancelledDueToErrorTasks
	      });

	      if (!task.cont) {
	        if (result.sagaStack) {
	          result.sagaStack = sagaStackToString(result.sagaStack);
	        }

	        if (result instanceof Error && onError) {
	          onError(result);
	        } else {
	          // TODO: could we skip this when _deferredEnd is attached?
	          logError(result);
	        }
	      }

	      iterator._error = result;
	      iterator._isAborted = true;
	      iterator._deferredEnd && iterator._deferredEnd.reject(result);
	    }

	    task.cont && task.cont(result, isErr);
	    task.joiners.forEach(function (j) {
	      return j.cb(result, isErr);
	    });
	    task.joiners = null;
	  }

	  function runEffect(effect, effectId, currCb) {
	    /**
	      each effect runner must attach its own logic of cancellation to the provided callback
	      it allows this generator to propagate cancellation downward.
	       ATTENTION! effect runners must setup the cancel logic by setting cb.cancel = [cancelMethod]
	      And the setup must occur before calling the callback
	       This is a sort of inversion of control: called async functions are responsible
	      of completing the flow by calling the provided continuation; while caller functions
	      are responsible for aborting the current flow by calling the attached cancel function
	       Library users can attach their own cancellation logic to promises by defining a
	      promise[CANCEL] method in their returned promises
	      ATTENTION! calling cancel must have no effect on an already completed or cancelled effect
	    **/
	    var data; // prettier-ignore

	    return (// Non declarative effect
	      is.promise(effect) ? resolvePromise(effect, currCb) : is.iterator(effect) ? resolveIterator(effect, effectId, meta, currCb) // declarative effects
	      : (data = asEffect.take(effect)) ? runTakeEffect(data, currCb) : (data = asEffect.put(effect)) ? runPutEffect(data, currCb) : (data = asEffect.all(effect)) ? runAllEffect(data, effectId, currCb) : (data = asEffect.race(effect)) ? runRaceEffect(data, effectId, currCb) : (data = asEffect.call(effect)) ? runCallEffect(data, effectId, currCb) : (data = asEffect.cps(effect)) ? runCPSEffect(data, currCb) : (data = asEffect.fork(effect)) ? runForkEffect(data, effectId, currCb) : (data = asEffect.join(effect)) ? runJoinEffect(data, currCb) : (data = asEffect.cancel(effect)) ? runCancelEffect(data, currCb) : (data = asEffect.select(effect)) ? runSelectEffect(data, currCb) : (data = asEffect.actionChannel(effect)) ? runChannelEffect(data, currCb) : (data = asEffect.flush(effect)) ? runFlushEffect(data, currCb) : (data = asEffect.cancelled(effect)) ? runCancelledEffect(data, currCb) : (data = asEffect.getContext(effect)) ? runGetContextEffect(data, currCb) : (data = asEffect.setContext(effect)) ? runSetContextEffect(data, currCb) :
	      /* anything else returned as is */
	      currCb(effect)
	    );
	  }

	  function digestEffect(effect, parentEffectId, label, cb) {
	    if (label === void 0) {
	      label = '';
	    }

	    var effectId = uid();
	    sagaMonitor && sagaMonitor.effectTriggered({
	      effectId: effectId,
	      parentEffectId: parentEffectId,
	      label: label,
	      effect: effect
	    });
	    /**
	      completion callback and cancel callback are mutually exclusive
	      We can't cancel an already completed effect
	      And We can't complete an already cancelled effectId
	    **/

	    var effectSettled; // Completion callback passed to the appropriate effect runner

	    function currCb(res, isErr) {
	      if (effectSettled) {
	        return;
	      }

	      effectSettled = true;
	      cb.cancel = noop; // defensive measure

	      if (sagaMonitor) {
	        isErr ? sagaMonitor.effectRejected(effectId, res) : sagaMonitor.effectResolved(effectId, res);
	      }

	      if (isErr) {
	        crashedEffect = effect;
	      }

	      cb(res, isErr);
	    } // tracks down the current cancel


	    currCb.cancel = noop; // setup cancellation logic on the parent cb

	    cb.cancel = function () {
	      // prevents cancelling an already completed effect
	      if (effectSettled) {
	        return;
	      }

	      effectSettled = true;
	      /**
	        propagates cancel downward
	        catch uncaught cancellations errors; since we can no longer call the completion
	        callback, log errors raised during cancellations into the console
	      **/

	      try {
	        currCb.cancel();
	      } catch (err) {
	        logError(err);
	      }

	      currCb.cancel = noop; // defensive measure

	      sagaMonitor && sagaMonitor.effectCancelled(effectId);
	    }; // if one can find a way to decouple runEffect from closure variables
	    // so it could be the call to it could be referentially transparent
	    // this potentially could be simplified, finalRunEffect created beforehand
	    // and this part of the code wouldnt have to know about middleware stuff


	    if (is.func(middleware)) {
	      middleware(function (eff) {
	        return runEffect(eff, effectId, currCb);
	      })(effect);
	      return;
	    }

	    runEffect(effect, effectId, currCb);
	  }

	  function resolvePromise(promise, cb) {
	    var cancelPromise = promise[CANCEL];

	    if (is.func(cancelPromise)) {
	      cb.cancel = cancelPromise;
	    } else if (is.func(promise.abort)) {
	      cb.cancel = function () {
	        return promise.abort();
	      };
	    }

	    promise.then(cb, function (error) {
	      return cb(error, true);
	    });
	  }

	  function resolveIterator(iterator, effectId, meta, cb) {
	    proc(iterator, stdChannel$$1, dispatch, getState, taskContext, options, effectId, meta, cb);
	  }

	  function runTakeEffect(_ref2, cb) {
	    var _ref2$channel = _ref2.channel,
	        channel$$1 = _ref2$channel === void 0 ? stdChannel$$1 : _ref2$channel,
	        pattern = _ref2.pattern,
	        maybe = _ref2.maybe;

	    var takeCb = function takeCb(input) {
	      if (input instanceof Error) {
	        cb(input, true);
	        return;
	      }

	      if (isEnd(input) && !maybe) {
	        cb(CHANNEL_END$1);
	        return;
	      }

	      cb(input);
	    };

	    try {
	      channel$$1.take(takeCb, is.notUndef(pattern) ? matcher(pattern) : null);
	    } catch (err) {
	      cb(err, true);
	      return;
	    }

	    cb.cancel = takeCb.cancel;
	  }

	  function runPutEffect(_ref3, cb) {
	    var channel$$1 = _ref3.channel,
	        action = _ref3.action,
	        resolve = _ref3.resolve;

	    /**
	      Schedule the put in case another saga is holding a lock.
	      The put will be executed atomically. ie nested puts will execute after
	      this put has terminated.
	    **/
	    asap(function () {
	      var result;

	      try {
	        result = (channel$$1 ? channel$$1.put : dispatch)(action);
	      } catch (error) {
	        cb(error, true);
	        return;
	      }

	      if (resolve && is.promise(result)) {
	        resolvePromise(result, cb);
	      } else {
	        cb(result);
	        return;
	      }
	    }); // Put effects are non cancellables
	  }

	  function runCallEffect(_ref4, effectId, cb) {
	    var context = _ref4.context,
	        fn = _ref4.fn,
	        args = _ref4.args;
	    var result; // catch synchronous failures; see #152

	    try {
	      result = fn.apply(context, args);
	    } catch (error) {
	      cb(error, true);
	      return;
	    }

	    return is.promise(result) ? resolvePromise(result, cb) : is.iterator(result) ? resolveIterator(result, effectId, getMetaInfo(fn), cb) : cb(result);
	  }

	  function runCPSEffect(_ref5, cb) {
	    var context = _ref5.context,
	        fn = _ref5.fn,
	        args = _ref5.args;

	    // CPS (ie node style functions) can define their own cancellation logic
	    // by setting cancel field on the cb
	    // catch synchronous failures; see #152
	    try {
	      var cpsCb = function cpsCb(err, res) {
	        return is.undef(err) ? cb(res) : cb(err, true);
	      };

	      fn.apply(context, args.concat(cpsCb));

	      if (cpsCb.cancel) {
	        cb.cancel = function () {
	          return cpsCb.cancel();
	        };
	      }
	    } catch (error) {
	      cb(error, true);
	      return;
	    }
	  }

	  function runForkEffect(_ref6, effectId, cb) {
	    var context = _ref6.context,
	        fn = _ref6.fn,
	        args = _ref6.args,
	        detached = _ref6.detached;
	    var taskIterator = createTaskIterator({
	      context: context,
	      fn: fn,
	      args: args
	    });
	    var meta = getIteratorMetaInfo(taskIterator, fn);

	    try {
	      suspend();

	      var _task = proc(taskIterator, stdChannel$$1, dispatch, getState, taskContext, options, effectId, meta, detached ? null : noop);

	      if (detached) {
	        cb(_task);
	      } else {
	        if (taskIterator._isRunning) {
	          taskQueue.addTask(_task);
	          cb(_task);
	        } else if (taskIterator._error) {
	          taskQueue.abort(taskIterator._error);
	        } else {
	          cb(_task);
	        }
	      }
	    } finally {
	      flush();
	    } // Fork effects are non cancellables

	  }

	  function runJoinEffect(t, cb) {
	    if (t.isRunning()) {
	      var joiner = {
	        task: task,
	        cb: cb
	      };

	      cb.cancel = function () {
	        return remove(t.joiners, joiner);
	      };

	      t.joiners.push(joiner);
	    } else {
	      t.isAborted() ? cb(t.error(), true) : cb(t.result());
	    }
	  }

	  function runCancelEffect(taskToCancel, cb) {
	    if (taskToCancel === SELF_CANCELLATION) {
	      taskToCancel = task;
	    }

	    if (taskToCancel.isRunning()) {
	      taskToCancel.cancel();
	    }

	    cb(); // cancel effects are non cancellables
	  }

	  function runAllEffect(effects, effectId, cb) {
	    var keys = Object.keys(effects);

	    if (!keys.length) {
	      cb(is.array(effects) ? [] : {});
	      return;
	    }

	    var completedCount = 0;
	    var completed;
	    var results = {};
	    var childCbs = {};

	    function checkEffectEnd() {
	      if (completedCount === keys.length) {
	        completed = true;
	        cb(is.array(effects) ? array.from(_extends$2({}, results, {
	          length: keys.length
	        })) : results);
	      }
	    }

	    keys.forEach(function (key) {
	      var chCbAtKey = function chCbAtKey(res, isErr) {
	        if (completed) {
	          return;
	        }

	        if (isErr || isEnd(res) || res === CHANNEL_END$1 || res === TASK_CANCEL$1) {
	          cb.cancel();
	          cb(res, isErr);
	        } else {
	          results[key] = res;
	          completedCount++;
	          checkEffectEnd();
	        }
	      };

	      chCbAtKey.cancel = noop;
	      childCbs[key] = chCbAtKey;
	    });

	    cb.cancel = function () {
	      if (!completed) {
	        completed = true;
	        keys.forEach(function (key) {
	          return childCbs[key].cancel();
	        });
	      }
	    };

	    keys.forEach(function (key) {
	      return digestEffect(effects[key], effectId, key, childCbs[key]);
	    });
	  }

	  function runRaceEffect(effects, effectId, cb) {
	    var completed;
	    var keys = Object.keys(effects);
	    var childCbs = {};
	    keys.forEach(function (key) {
	      var chCbAtKey = function chCbAtKey(res, isErr) {
	        if (completed) {
	          return;
	        }

	        if (isErr) {
	          // Race Auto cancellation
	          cb.cancel();
	          cb(res, true);
	        } else if (!isEnd(res) && res !== CHANNEL_END$1 && res !== TASK_CANCEL$1) {
	          var _response;

	          cb.cancel();
	          completed = true;
	          var response = (_response = {}, _response[key] = res, _response);
	          cb(is.array(effects) ? [].slice.call(_extends$2({}, response, {
	            length: keys.length
	          })) : response);
	        }
	      };

	      chCbAtKey.cancel = noop;
	      childCbs[key] = chCbAtKey;
	    });

	    cb.cancel = function () {
	      // prevents unnecessary cancellation
	      if (!completed) {
	        completed = true;
	        keys.forEach(function (key) {
	          return childCbs[key].cancel();
	        });
	      }
	    };

	    keys.forEach(function (key) {
	      if (completed) {
	        return;
	      }

	      digestEffect(effects[key], effectId, key, childCbs[key]);
	    });
	  }

	  function runSelectEffect(_ref7, cb) {
	    var selector = _ref7.selector,
	        args = _ref7.args;

	    try {
	      var state = selector.apply(void 0, [getState()].concat(args));
	      cb(state);
	    } catch (error) {
	      cb(error, true);
	    }
	  }

	  function runChannelEffect(_ref8, cb) {
	    var pattern = _ref8.pattern,
	        buffer = _ref8.buffer;
	    // TODO: rethink how END is handled
	    var chan = channel(buffer);
	    var match = matcher(pattern);

	    var taker = function taker(action) {
	      if (!isEnd(action)) {
	        stdChannel$$1.take(taker, match);
	      }

	      chan.put(action);
	    };

	    stdChannel$$1.take(taker, match);
	    cb(chan);
	  }

	  function runCancelledEffect(data, cb) {
	    cb(!!mainTask.isCancelled);
	  }

	  function runFlushEffect(channel$$1, cb) {
	    channel$$1.flush(cb);
	  }

	  function runGetContextEffect(prop, cb) {
	    cb(taskContext[prop]);
	  }

	  function runSetContextEffect(props, cb) {
	    object.assign(taskContext, props);
	    cb();
	  }

	  function newTask(id, meta, iterator, cont) {
	    var _ref9;

	    iterator._deferredEnd = null;
	    return _ref9 = {}, _ref9[TASK] = true, _ref9.id = id, _ref9.meta = meta, _ref9.toPromise = function toPromise() {
	      if (iterator._deferredEnd) {
	        return iterator._deferredEnd.promise;
	      }

	      var def = deferred();
	      iterator._deferredEnd = def;

	      if (!iterator._isRunning) {
	        if (iterator._isAborted) {
	          def.reject(iterator._error);
	        } else {
	          def.resolve(iterator._result);
	        }
	      }

	      return def.promise;
	    }, _ref9.cont = cont, _ref9.joiners = [], _ref9.cancel = cancel, _ref9.isRunning = function isRunning() {
	      return iterator._isRunning;
	    }, _ref9.isCancelled = function isCancelled() {
	      return iterator._isCancelled;
	    }, _ref9.isAborted = function isAborted() {
	      return iterator._isAborted;
	    }, _ref9.result = function result() {
	      return iterator._result;
	    }, _ref9.error = function error() {
	      return iterator._error;
	    }, _ref9.setContext = function setContext$$1(props) {
	      {
	        check(props, is.object, createSetContextWarning('task', props));
	      }

	      object.assign(taskContext, props);
	    }, _ref9;
	  }
	}

	var RUN_SAGA_SIGNATURE = 'runSaga(options, saga, ...args)';
	var NON_GENERATOR_ERR = RUN_SAGA_SIGNATURE + ": saga argument must be a Generator function!";
	function runSaga(options, saga) {
	  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  {
	    check(saga, is.func, NON_GENERATOR_ERR);
	  }

	  var iterator = saga.apply(void 0, args);

	  {
	    check(iterator, is.iterator, NON_GENERATOR_ERR);
	  }

	  var _options$channel = options.channel,
	      channel$$1 = _options$channel === void 0 ? stdChannel() : _options$channel,
	      dispatch = options.dispatch,
	      getState = options.getState,
	      context = options.context,
	      sagaMonitor = options.sagaMonitor,
	      logger = options.logger,
	      effectMiddlewares = options.effectMiddlewares,
	      onError = options.onError;
	  var effectId = uid();

	  if (sagaMonitor) {
	    // monitors are expected to have a certain interface, let's fill-in any missing ones
	    sagaMonitor.effectTriggered = sagaMonitor.effectTriggered || noop;
	    sagaMonitor.effectResolved = sagaMonitor.effectResolved || noop;
	    sagaMonitor.effectRejected = sagaMonitor.effectRejected || noop;
	    sagaMonitor.effectCancelled = sagaMonitor.effectCancelled || noop;
	    sagaMonitor.actionDispatched = sagaMonitor.actionDispatched || noop;
	    sagaMonitor.effectTriggered({
	      effectId: effectId,
	      root: true,
	      parentEffectId: 0,
	      effect: {
	        root: true,
	        saga: saga,
	        args: args
	      }
	    });
	  }

	  if (is.notUndef(effectMiddlewares)) {
	    var MIDDLEWARE_TYPE_ERROR = 'effectMiddlewares must be an array of functions';
	    check(effectMiddlewares, is.array, MIDDLEWARE_TYPE_ERROR);
	    effectMiddlewares.forEach(function (effectMiddleware) {
	      return check(effectMiddleware, is.func, MIDDLEWARE_TYPE_ERROR);
	    });
	  }

	  var middleware = effectMiddlewares && compose.apply(void 0, effectMiddlewares);
	  var task = proc(iterator, channel$$1, wrapSagaDispatch(dispatch), getState, context, {
	    sagaMonitor: sagaMonitor,
	    logger: logger,
	    onError: onError,
	    middleware: middleware
	  }, effectId, getMetaInfo(saga));

	  if (sagaMonitor) {
	    sagaMonitor.effectResolved(effectId, task);
	  }

	  return task;
	}

	function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
	function sagaMiddlewareFactory(_ref) {
	  if (_ref === void 0) {
	    _ref = {};
	  }

	  var _ref2 = _ref,
	      _ref2$context = _ref2.context,
	      context = _ref2$context === void 0 ? {} : _ref2$context,
	      options = _objectWithoutProperties(_ref2, ["context"]);

	  var sagaMonitor = options.sagaMonitor,
	      logger = options.logger,
	      onError = options.onError,
	      effectMiddlewares = options.effectMiddlewares;

	  {
	    if (is.notUndef(logger)) {
	      check(logger, is.func, 'options.logger passed to the Saga middleware is not a function!');
	    }

	    if (is.notUndef(onError)) {
	      check(onError, is.func, 'options.onError passed to the Saga middleware is not a function!');
	    }

	    if (is.notUndef(options.emitter)) {
	      check(options.emitter, is.func, 'options.emitter passed to the Saga middleware is not a function!');
	    }
	  }

	  function sagaMiddleware(_ref3) {
	    var getState = _ref3.getState,
	        dispatch = _ref3.dispatch;
	    var channel$$1 = stdChannel();
	    channel$$1.put = (options.emitter || identity)(channel$$1.put);
	    sagaMiddleware.run = runSaga.bind(null, {
	      context: context,
	      channel: channel$$1,
	      dispatch: dispatch,
	      getState: getState,
	      sagaMonitor: sagaMonitor,
	      logger: logger,
	      onError: onError,
	      effectMiddlewares: effectMiddlewares
	    });
	    return function (next) {
	      return function (action) {
	        if (sagaMonitor && sagaMonitor.actionDispatched) {
	          sagaMonitor.actionDispatched(action);
	        }

	        var result = next(action); // hit reducers

	        channel$$1.put(action);
	        return result;
	      };
	    };
	  }

	  sagaMiddleware.run = function () {
	    throw new Error('Before running a Saga, you must mount the Saga middleware on the Store using applyMiddleware');
	  };

	  sagaMiddleware.setContext = function (props) {
	    {
	      check(props, is.object, createSetContextWarning('sagaMiddleware', props));
	    }

	    object.assign(context, props);
	  };

	  return sagaMiddleware;
	}

	var name = "fractal-component";
	var version = "1.0.0";
	var description = "`fractal-component` helps to encapsulate state store access, actions (messages, events) processing and side-effect management into decoupled container components.";
	var main = "dist/fractal-component.cjs.js";
	var module$1 = "dist/fractal-component.esm.js";
	var unpkg = "dist/fractal-component.min.umd.js";
	var files = ["dist", "*.d.ts"];
	var scripts = {
	  prettier: "prettier --write 'src/*.js' 'src/*.ts'",
	  eslint: "eslint 'src/*.js'",
	  test: "jest",
	  prebundlesize: "npm run build",
	  bundlesize: "bundlesize",
	  clean: "rimraf dist",
	  prebuild: "npm run clean",
	  build: "rollup -c",
	  prepare: "npm run build",
	  prepush: "npm run test",
	  preversion: "npm run test && npm run prepare",
	  "release:patch": "npm version patch && npm publish && git push --follow-tags",
	  "release:minor": "npm version minor && npm publish && git push --follow-tags",
	  "release:major": "npm version major && npm publish && git push --follow-tags"
	};
	var repository = {
	  type: "git",
	  url: "git+https://github.com/t83714/fractal-component.git"
	};
	var keywords = ["javascript", "redux", "react", "saga", "fractal component", "encapsulation", "namespaced action", "namespaced store", "multicast action", "multicast messaging", "reducer hot loading", "saga hot loading"];
	var homepage = "https://github.com/t83714/fractal-component";
	var author = "Jacky Jiang <t83714@gmail.com>";
	var license = "MIT";
	var bugs = {
	  url: "https://github.com/t83714/fractal-component/issues"
	};
	var bundlesize = [{
	  path: "./dist/fractal-component.min.js",
	  maxSize: "15 Kb"
	}];
	var dependencies = {
	  "@babel/runtime": "^7.0.0-rc.3",
	  lodash: "^4.17.10",
	  "object-path": "^0.11.4",
	  "object-path-immutable": "^3.0.0",
	  redux: "^4.0.0",
	  "redux-saga": "^1.0.0-beta.1"
	};
	var peerDependencies = {
	  "prop-types": ">= 15.5.7",
	  react: ">= 15.0.0"
	};
	var devDependencies = {
	  "@babel/cli": "^7.0.0-beta.54",
	  "@babel/core": "^7.0.0-beta.54",
	  "@babel/node": "^7.0.0-beta.54",
	  "@babel/plugin-transform-runtime": "^7.0.0-rc.3",
	  "@babel/polyfill": "^7.0.0-beta.54",
	  "@babel/preset-env": "^7.0.0-beta.54",
	  "@babel/preset-react": "^7.0.0-beta.54",
	  "@babel/preset-stage-2": "^7.0.0-beta.54",
	  "babel-eslint": "^8.2.6",
	  "babel-plugin-annotate-pure-calls": "babel7",
	  bundlesize: "^0.17.0",
	  eslint: "^5.2.0",
	  "eslint-plugin-react": "^7.11.1",
	  "npm-run-all": "^4.1.3",
	  prettier: "^1.13.7",
	  "redux-devtools-extension": "^2.13.5",
	  rimraf: "^2.6.2",
	  rollup: "^0.64.1",
	  "rollup-plugin-babel": "4.0.0-beta.1",
	  "rollup-plugin-commonjs": "^9.1.5",
	  "rollup-plugin-json": "^3.0.0",
	  "rollup-plugin-node-builtins": "^2.1.2",
	  "rollup-plugin-node-resolve": "^3.3.0",
	  "rollup-plugin-replace": "^2.0.0",
	  "rollup-plugin-uglify": "^4.0.0"
	};
	var typings = "./src/index.d.ts";
	var npmName = "fractal-component";
	var npmFileMap = [{
	  basePath: "/dist/",
	  files: ["*.js"]
	}];
	var pkg = {
	  name: name,
	  version: version,
	  description: description,
	  main: main,
	  module: module$1,
	  unpkg: unpkg,
	  files: files,
	  scripts: scripts,
	  repository: repository,
	  keywords: keywords,
	  homepage: homepage,
	  author: author,
	  license: license,
	  "private": true,
	  bugs: bugs,
	  bundlesize: bundlesize,
	  dependencies: dependencies,
	  peerDependencies: peerDependencies,
	  devDependencies: devDependencies,
	  typings: typings,
	  npmName: npmName,
	  npmFileMap: npmFileMap
	};

	var NAMESPACED =
	/*#__PURE__*/
	Symbol("@@" + pkg.name + "/NAMESPACED");

	var devMode = false;

	if (process && process.env && "development" && "development" === "development") {
	  devMode = true;
	}

	var IS_NODE = null;
	var isInNode = function isInNode() {
	  if (IS_NODE === null) {
	    IS_NODE = typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";
	  }

	  return IS_NODE;
	};
	/**
	 * Modified from https://github.com/adamhalasz/uniqid
	 */

	var machineInfo = null;
	var getMachineInfo = function getMachineInfo() {
	  if (machineInfo !== null) return machineInfo;

	  if (!isInNode()) {
	    machineInfo = {
	      pid: null,
	      macAddr: "",
	      macAddrInt: null
	    };
	    return machineInfo;
	  }

	  var macAddr = "",
	      macAddrInt = null,
	      pid = null;

	  try {
	    var networkInterfaces = require("os").networkInterfaces();

	    var interface_key;

	    for (interface_key in networkInterfaces) {
	      var networkInterface = networkInterfaces[interface_key];
	      var length = networkInterface.length;

	      for (var i = 0; i < length; i++) {
	        if (networkInterface[i].mac && networkInterface[i].mac != "00:00:00:00:00:00") {
	          macAddr = networkInterface[i].mac;
	          break;
	        }
	      }

	      if (macAddr !== "") break;
	    }

	    pid = process && process.pid ? process.pid : null;
	    macAddrInt = macAddr ? parseInt(macAddr.replace(/\:|\D+/gi, "")) : null;
	    if (isNaN(macAddrInt)) macAddrInt = null;
	  } catch (e) {}

	  machineInfo = {
	    pid: pid,
	    macAddr: macAddr,
	    macAddrInt: macAddrInt
	  };
	  return machineInfo;
	};
	var lastTimeStamp = null;
	var uniqid = function uniqid(prefix) {
	  var _getMachineInfo = getMachineInfo(),
	      pid = _getMachineInfo.pid,
	      mac = _getMachineInfo.macAddrInt;

	  if (is$1.number(pid) && pid) {
	    pid = pid.toString(36);
	  } else {
	    pid = "";
	  }

	  if (is$1.number(mac) && mac) {
	    mac = mac.toString(36);
	  } else {
	    mac = "";
	  }

	  var now = Date.now();
	  var last = lastTimeStamp || now;
	  lastTimeStamp = now > last ? now : last + 1;
	  return (prefix || "") + mac + pid + lastTimeStamp.toString(36);
	};
	var getPackageName = function getPackageName() {
	  return pkg.name;
	};
	var getPackageVersion = function getPackageVersion() {
	  return pkg.version;
	};
	var isDevMode = function isDevMode() {
	  return devMode;
	};
	var log$1 = function log(message, level, error) {
	  if (level === void 0) {
	    level = "log";
	  }

	  if (error === void 0) {
	    error = "";
	  }

	  /*eslint-disable no-console*/
	  if (typeof window === "undefined") {
	    console.log("fractal-component " + level + ": " + message + "\n" + (error && error.stack || error));
	  } else {
	    console[level](message, error);
	  }
	};
	var trim = function trim(v) {
	  if (!v) return "";
	  if (is$1.string(v)) return v.trim();
	  var s = String(v);
	  return s.trim();
	};
	var konst$1 = function konst(v) {
	  return function () {
	    return v;
	  };
	};
	var kTrue$1 =
	/*#__PURE__*/
	konst$1(true);
	var kFalse$1 =
	/*#__PURE__*/
	konst$1(false);
	var noop$1 = function noop$$1() {};
	var identity$1 = function identity(v) {
	  return v;
	};
	var is$1 =
	/*#__PURE__*/
	_extends_1({}, is, {
	  bool: function bool(v) {
	    return typeof v === "boolean";
	  },
	  action: function action(v) {
	    return is.object(v) && is.symbol(v.type);
	  },
	  namespacedAction: function namespacedAction(v) {
	    return is$1.action(v) && v[NAMESPACED];
	  }
	});

	var utils = /*#__PURE__*/Object.freeze({
		isInNode: isInNode,
		getMachineInfo: getMachineInfo,
		uniqid: uniqid,
		getPackageName: getPackageName,
		getPackageVersion: getPackageVersion,
		isDevMode: isDevMode,
		log: log$1,
		trim: trim,
		konst: konst$1,
		kTrue: kTrue$1,
		kFalse: kFalse$1,
		noop: noop$1,
		identity: identity$1,
		is: is$1
	});

	var PathContext =
	/*#__PURE__*/
	function () {
	  function PathContext(cwd) {
	    this.cwd = normalize(cwd);
	    if (this.cwd.indexOf("*") !== -1) throw new Error("`cwd` cannot contains `*`");

	    if (this.cwd.indexOf(".") !== -1) {
	      this.cwd = this.compressPath(this.cwd);
	    }
	  }

	  var _proto = PathContext.prototype;

	  _proto.getLastSegment = function getLastSegment() {
	    var idx = this.cwd.lastIndexOf("/");
	    if (idx >= this.cwd.length - 1) return "";
	    return this.cwd.substring(idx + 1);
	  };

	  _proto.compressPath = function compressPath(paths, ignoreExcessDoubleDot) {
	    if (ignoreExcessDoubleDot === void 0) {
	      ignoreExcessDoubleDot = true;
	    }

	    if (is$1.string(paths)) paths = [paths];
	    var calculatedParts = [];
	    paths.map(function (p) {
	      return p.trim();
	    }).forEach(function (p) {
	      if (p.indexOf("*") !== -1) throw new Error("Failed to resolve path: path segments cannot contain `*`");
	      p.split("/").forEach(function (item) {
	        item = trim(item);

	        switch (item) {
	          case "":
	            break;

	          case ".":
	            break;

	          case "..":
	            if (calculatedParts.length) {
	              calculatedParts.pop();
	            } else {
	              if (!ignoreExcessDoubleDot) {
	                calculatedParts.push("..");
	              }
	            }

	            break;

	          default:
	            calculatedParts.push(item);
	        }
	      });
	    });
	    return calculatedParts.join("/");
	  };

	  _proto.resolve = function resolve() {
	    for (var _len = arguments.length, paths = new Array(_len), _key = 0; _key < _len; _key++) {
	      paths[_key] = arguments[_key];
	    }

	    var pathItems = [this.cwd].concat(paths);
	    return this.compressPath(pathItems);
	  };

	  _proto.convertNamespacedAction = function convertNamespacedAction(action, relativeDispatchPath) {
	    var _extends2;

	    if (!is$1.object(action)) {
	      throw new Error("Tried to dispatch action in invalid type: " + typeof action);
	    }

	    if (!is$1.symbol(action.type)) {
	      throw new Error("action.type cannot be " + typeof action.type + " and must be a Symbol");
	    }

	    var path = normalize(relativeDispatchPath);
	    var isMulticast = false;

	    if (path.length && path[path.length - 1] === "*") {
	      isMulticast = true;
	      path = normalize(path.substring(0, path.length - 1));
	    }

	    var absolutePath = this.resolve(path);

	    var newAction = _extends_1({}, action, (_extends2 = {}, _extends2[NAMESPACED] = true, _extends2.isMulticast = isMulticast, _extends2.currentSenderPath = this.cwd, _extends2.currentDispatchPath = absolutePath, _extends2.currentComponentId = this.getLastSegment(), _extends2));

	    if (!newAction.senderPath) newAction.senderPath = newAction.currentSenderPath;
	    if (!newAction.dispatchPath) newAction.dispatchPath = newAction.currentDispatchPath;
	    if (!newAction.componentId) newAction.componentId = newAction.currentComponentId;
	    return newAction;
	  };

	  return PathContext;
	}();

	var PathRegistry =
	/*#__PURE__*/
	function () {
	  function PathRegistry() {
	    this.paths = [];
	    this.dataStore = {};
	  }

	  var _proto2 = PathRegistry.prototype;

	  _proto2.add = function add(path, data) {
	    if (data === void 0) {
	      data = undefined;
	    }

	    validate(path);
	    path = normalize(path);
	    if (this.paths.indexOf(path) !== -1) return null;
	    this.paths.push(path);
	    if (is$1.notUndef(data)) this.dataStore[path] = data;
	    return path;
	  };

	  _proto2.getPathData = function getPathData(path) {
	    var data = this.dataStore[path];
	    return data ? data : {};
	  };

	  _proto2.setPathData = function setPathData(path, data) {
	    this.dataStore[path] = data;
	  };

	  _proto2.mergePathData = function mergePathData(path, data) {
	    if (is$1.object(this.dataStore[path])) {
	      this.dataStore[path] = Object.assign({}, this.dataStore[path], data);
	    } else {
	      this.dataStore[path] = data;
	    }
	  };

	  _proto2.removePathData = function removePathData(path) {
	    delete this.dataStore[path];
	  };

	  _proto2.foreach = function foreach(iteratee) {
	    var _this = this;

	    Object.keys(this.dataStore).forEach(function (key) {
	      return iteratee(_this.dataStore[key], key);
	    });
	  };

	  _proto2.map = function map(iteratee) {
	    var _this2 = this;

	    return Object.keys(this.dataStore).map(function (key) {
	      return iteratee(_this2.dataStore[key], key);
	    });
	  };

	  _proto2.searchPathByPathData = function searchPathByPathData(predictFunc) {
	    var _this3 = this;

	    if (!is$1.func(predictFunc)) throw new Error("searchPathByPathData require function as parameter!");
	    return Object.keys(this.dataStore).find(function (key) {
	      return predictFunc(_this3.dataStore[key]);
	    });
	  };

	  _proto2.remove = function remove(path) {
	    validate(path);
	    path = normalize(path);
	    this.paths = this.paths.filter(function (item) {
	      return item !== path;
	    });
	    delete this.dataStore[path];
	  };

	  _proto2.exist = function exist(path) {
	    if (this.paths.indexOf(path) !== -1) return true;else return false;
	  };

	  _proto2.isAllowedMulticast = function isAllowedMulticast(path, actionType) {
	    var _this$getPathData = this.getPathData(path),
	        allowedIncomingMulticastActionTypes = _this$getPathData.allowedIncomingMulticastActionTypes;

	    if (!allowedIncomingMulticastActionTypes) return false;
	    if (is$1.string(allowedIncomingMulticastActionTypes) && allowedIncomingMulticastActionTypes === "*") return true;

	    if (is$1.symbol(allowedIncomingMulticastActionTypes)) {
	      return allowedIncomingMulticastActionTypes === actionType;
	    }

	    if (!is$1.array(allowedIncomingMulticastActionTypes)) {
	      throw new Error("PathRegistry.isAllowedMulticast: invalid `allowedIncomingMulticastActionTypes` option type. ");
	    }

	    return allowedIncomingMulticastActionTypes.indexOf(actionType) !== -1;
	  };
	  /**
	   *
	   * @param {Action} action dispatch Action
	   *
	   */


	  _proto2.searchDispatchPaths = function searchDispatchPaths(action) {
	    var _this4 = this;

	    if (action[NAMESPACED] !== true) {
	      throw new Error("PathRegistry: cannot searchDispatchPaths for a non-namespaced action.");
	    }

	    var dispatchPath = action.currentDispatchPath,
	        isMulticast = action.isMulticast;

	    if (!isMulticast) {
	      if (this.exist(dispatchPath)) return [dispatchPath];else return [];
	    }

	    var r = this.paths.filter(function (item) {
	      // --- only include sub branch paths. e.g. `dispatchPath` is part of and shorter than `item`
	      // --- exact same path should also be included e.g. item === dispatchPath
	      if (item.indexOf(dispatchPath + "/") !== 0 && item !== dispatchPath) return false;

	      var _this4$getPathData = _this4.getPathData(item),
	          allowedIncomingMulticastActionTypes = _this4$getPathData.allowedIncomingMulticastActionTypes;

	      if (allowedIncomingMulticastActionTypes === "*") {
	        /**
	         * If a component is set to accept `any` action types (i.e. `allowedIncomingMulticastActionTypes` set to "*"), the dispatch path
	         * must on or beyond local namespace boundary before a multicast action is dispatched to this component.
	         * e.g. For a component:
	         * Namespace Prefix                Namespace                   ComponentID
	         * exampleApp/Gifs   /  io.github.t83714/ActionForwarder    /  sdjiere
	         * The local namespace boundary is between `exampleApp/Gifs` and `io.github.t83714/ActionForwarder/sdjiere`
	         * Actions dispatched on `exampleApp/Gifs` (on boundary) or
	         * `exampleApp/Gifs/io.github.t83714` (beyond the boundary) will be accepted by this component.
	         * Actions dispatched on `exampleApp` will not be accepted by this component.
	         */
	        var _ref = _this4.dataStore[item] ? _this4.dataStore[item] : {},
	            localPathPos = _ref.localPathPos;

	        if (!is$1.number(localPathPos)) return true;
	        if (dispatchPath.length - 1 >= localPathPos - 2) return true;
	        return false;
	      } else {
	        // --- only components / registered path accepts Multicast action will be included.
	        return _this4.isAllowedMulticast(item, action.type);
	      }
	    });
	    return r;
	  };

	  return PathRegistry;
	}();
	function validate(path) {
	  if (path.indexOf("*") !== -1) {
	    throw new Error("path cannot contain `*`");
	  }
	}
	function normalize(path, toLowerCase) {
	  if (toLowerCase === void 0) {
	    toLowerCase = false;
	  }

	  path = trim(path);
	  if (toLowerCase) path = path.toLowerCase();

	  if (path[0] === "/") {
	    if (path.length === 1) {
	      path = "";
	    } else {
	      path = path.substring(1);
	    }
	  }

	  if (path[path.length - 1] === "/") {
	    if (path.length === 1) {
	      path = "";
	    } else {
	      path = path.substring(0, path.length - 1);
	    }
	  }

	  return path;
	}

	var objectPath = createCommonjsModule(function (module) {
	(function (root, factory){

	  /*istanbul ignore next:cant test*/
	  {
	    module.exports = factory();
	  }
	})(commonjsGlobal, function(){

	  var toStr = Object.prototype.toString;
	  function hasOwnProperty(obj, prop) {
	    if(obj == null) {
	      return false
	    }
	    //to handle objects with null prototypes (too edge case?)
	    return Object.prototype.hasOwnProperty.call(obj, prop)
	  }

	  function isEmpty(value){
	    if (!value) {
	      return true;
	    }
	    if (isArray(value) && value.length === 0) {
	        return true;
	    } else if (typeof value !== 'string') {
	        for (var i in value) {
	            if (hasOwnProperty(value, i)) {
	                return false;
	            }
	        }
	        return true;
	    }
	    return false;
	  }

	  function toString(type){
	    return toStr.call(type);
	  }

	  function isObject(obj){
	    return typeof obj === 'object' && toString(obj) === "[object Object]";
	  }

	  var isArray = Array.isArray || function(obj){
	    /*istanbul ignore next:cant test*/
	    return toStr.call(obj) === '[object Array]';
	  };

	  function isBoolean(obj){
	    return typeof obj === 'boolean' || toString(obj) === '[object Boolean]';
	  }

	  function getKey(key){
	    var intKey = parseInt(key);
	    if (intKey.toString() === key) {
	      return intKey;
	    }
	    return key;
	  }

	  function factory(options) {
	    options = options || {};

	    var objectPath = function(obj) {
	      return Object.keys(objectPath).reduce(function(proxy, prop) {
	        if(prop === 'create') {
	          return proxy;
	        }

	        /*istanbul ignore else*/
	        if (typeof objectPath[prop] === 'function') {
	          proxy[prop] = objectPath[prop].bind(objectPath, obj);
	        }

	        return proxy;
	      }, {});
	    };

	    function hasShallowProperty(obj, prop) {
	      return (options.includeInheritedProps || (typeof prop === 'number' && Array.isArray(obj)) || hasOwnProperty(obj, prop))
	    }

	    function getShallowProperty(obj, prop) {
	      if (hasShallowProperty(obj, prop)) {
	        return obj[prop];
	      }
	    }

	    function set(obj, path, value, doNotReplace){
	      if (typeof path === 'number') {
	        path = [path];
	      }
	      if (!path || path.length === 0) {
	        return obj;
	      }
	      if (typeof path === 'string') {
	        return set(obj, path.split('.').map(getKey), value, doNotReplace);
	      }
	      var currentPath = path[0];
	      var currentValue = getShallowProperty(obj, currentPath);
	      if (path.length === 1) {
	        if (currentValue === void 0 || !doNotReplace) {
	          obj[currentPath] = value;
	        }
	        return currentValue;
	      }

	      if (currentValue === void 0) {
	        //check if we assume an array
	        if(typeof path[1] === 'number') {
	          obj[currentPath] = [];
	        } else {
	          obj[currentPath] = {};
	        }
	      }

	      return set(obj[currentPath], path.slice(1), value, doNotReplace);
	    }

	    objectPath.has = function (obj, path) {
	      if (typeof path === 'number') {
	        path = [path];
	      } else if (typeof path === 'string') {
	        path = path.split('.');
	      }

	      if (!path || path.length === 0) {
	        return !!obj;
	      }

	      for (var i = 0; i < path.length; i++) {
	        var j = getKey(path[i]);

	        if((typeof j === 'number' && isArray(obj) && j < obj.length) ||
	          (options.includeInheritedProps ? (j in Object(obj)) : hasOwnProperty(obj, j))) {
	          obj = obj[j];
	        } else {
	          return false;
	        }
	      }

	      return true;
	    };

	    objectPath.ensureExists = function (obj, path, value){
	      return set(obj, path, value, true);
	    };

	    objectPath.set = function (obj, path, value, doNotReplace){
	      return set(obj, path, value, doNotReplace);
	    };

	    objectPath.insert = function (obj, path, value, at){
	      var arr = objectPath.get(obj, path);
	      at = ~~at;
	      if (!isArray(arr)) {
	        arr = [];
	        objectPath.set(obj, path, arr);
	      }
	      arr.splice(at, 0, value);
	    };

	    objectPath.empty = function(obj, path) {
	      if (isEmpty(path)) {
	        return void 0;
	      }
	      if (obj == null) {
	        return void 0;
	      }

	      var value, i;
	      if (!(value = objectPath.get(obj, path))) {
	        return void 0;
	      }

	      if (typeof value === 'string') {
	        return objectPath.set(obj, path, '');
	      } else if (isBoolean(value)) {
	        return objectPath.set(obj, path, false);
	      } else if (typeof value === 'number') {
	        return objectPath.set(obj, path, 0);
	      } else if (isArray(value)) {
	        value.length = 0;
	      } else if (isObject(value)) {
	        for (i in value) {
	          if (hasShallowProperty(value, i)) {
	            delete value[i];
	          }
	        }
	      } else {
	        return objectPath.set(obj, path, null);
	      }
	    };

	    objectPath.push = function (obj, path /*, values */){
	      var arr = objectPath.get(obj, path);
	      if (!isArray(arr)) {
	        arr = [];
	        objectPath.set(obj, path, arr);
	      }

	      arr.push.apply(arr, Array.prototype.slice.call(arguments, 2));
	    };

	    objectPath.coalesce = function (obj, paths, defaultValue) {
	      var value;

	      for (var i = 0, len = paths.length; i < len; i++) {
	        if ((value = objectPath.get(obj, paths[i])) !== void 0) {
	          return value;
	        }
	      }

	      return defaultValue;
	    };

	    objectPath.get = function (obj, path, defaultValue){
	      if (typeof path === 'number') {
	        path = [path];
	      }
	      if (!path || path.length === 0) {
	        return obj;
	      }
	      if (obj == null) {
	        return defaultValue;
	      }
	      if (typeof path === 'string') {
	        return objectPath.get(obj, path.split('.'), defaultValue);
	      }

	      var currentPath = getKey(path[0]);
	      var nextObj = getShallowProperty(obj, currentPath);
	      if (nextObj === void 0) {
	        return defaultValue;
	      }

	      if (path.length === 1) {
	        return nextObj;
	      }

	      return objectPath.get(obj[currentPath], path.slice(1), defaultValue);
	    };

	    objectPath.del = function del(obj, path) {
	      if (typeof path === 'number') {
	        path = [path];
	      }

	      if (obj == null) {
	        return obj;
	      }

	      if (isEmpty(path)) {
	        return obj;
	      }
	      if(typeof path === 'string') {
	        return objectPath.del(obj, path.split('.'));
	      }

	      var currentPath = getKey(path[0]);
	      if (!hasShallowProperty(obj, currentPath)) {
	        return obj;
	      }

	      if(path.length === 1) {
	        if (isArray(obj)) {
	          obj.splice(currentPath, 1);
	        } else {
	          delete obj[currentPath];
	        }
	      } else {
	        return objectPath.del(obj[currentPath], path.slice(1));
	      }

	      return obj;
	    };

	    return objectPath;
	  }

	  var mod = factory();
	  mod.create = factory;
	  mod.withInheritedProps = factory({includeInheritedProps: true});
	  return mod;
	});
	});

	var defaultOptions = {
	  saga: null,
	  initState: {},
	  reducer: null,
	  namespace: null,
	  namespacePrefix: null,
	  componentId: null,
	  persistState: false,
	  //--- when `allowedIncomingMulticastActionTypes` is string
	  //--- only "*" is accepted (means accepting any actionTypes)
	  allowedIncomingMulticastActionTypes: null,
	  isServerSideRendering: false
	};
	var pkgName =
	/*#__PURE__*/
	getPackageName();
	var COMPONENT_MANAGER_LOCAL_KEY =
	/*#__PURE__*/
	Symbol("COMPONENT_MANAGER_LOCAL_KEY");

	var ComponentManager =
	/*#__PURE__*/
	function () {
	  function ComponentManager(componentInstance, options, appContainer) {
	    this.componentInstance = componentInstance;
	    this.options = _extends_1({}, defaultOptions, options);
	    this.appContainer = appContainer;
	    this.store = appContainer.store;
	    this.isInitialized = false;
	    this.isDestroyed = false;
	    this.initCallback = noop$1;
	    this.destroyCallback = noop$1;
	    this.storeListener = bindStoreListener.bind(this);
	    this.storeListenerUnsubscribe = null;
	    this.managingInstance = componentInstance;
	    this.displayName = getComponentName(this.managingInstance);
	    var settleStringSettingFunc = settleStringSetting.bind(this);
	    this.namespace = normalize(settleStringSettingFunc(this.options.namespace));
	    if (this.namespace.indexOf("*") !== -1) throw new Error("`Namespace` cannot contain `*`.");
	    if (!this.namespace) throw new Error("Missing Component `namespace`: Component `namespace` must be specified.");
	    this.isAutoComponentId = false;
	    this.componentId = normalize(settleStringSettingFunc(this.options.componentId));
	    if (this.componentId.indexOf("/") !== -1 || this.componentId.indexOf("*") !== -1) throw new Error("`Component ID` cannot contain `/` or `*`.");

	    if (!this.componentId) {
	      this.isAutoComponentId = true;
	      this.componentId = uniqid();
	    }

	    if (this.componentInstance.props && this.componentInstance.props.namespacePrefix) {
	      this.namespacePrefix = normalize(settleStringSettingFunc(this.componentInstance.props.namespacePrefix));
	    }

	    if (!this.namespacePrefix) {
	      this.namespacePrefix = normalize(settleStringSettingFunc(this.options.namespacePrefix));
	    }

	    if (this.namespacePrefix.indexOf("*") !== -1) throw new Error("`namespacePrefix` cannot contain `*`.");
	    this.isServerSideRendering = this.options.isServerSideRendering;
	    this.persistState = this.options.persistState;
	    this.fullNamespace = fullNamespace.bind(this)();
	    this.fullPath = fullPath.bind(this)();
	    this.fullLocalPath = fullLocalPath.bind(this)();
	    this.allowedIncomingMulticastActionTypes = this.options.allowedIncomingMulticastActionTypes;
	    determineInitState.apply(this);
	  }

	  var _proto = ComponentManager.prototype;

	  _proto.enhanceComponentInstance = function enhanceComponentInstance(initCallback, destroyCallback) {
	    if (initCallback === void 0) {
	      initCallback = null;
	    }

	    if (destroyCallback === void 0) {
	      destroyCallback = null;
	    }

	    if (initCallback) {
	      this.initCallback = initCallback;
	    }

	    if (destroyCallback) {
	      this.destroyCallback = destroyCallback;
	    } //--- should NOT shallow copy to avoid unnecessary render


	    this.componentInstance.state = this.initState;
	    this.setState = this.componentInstance.setState.bind(this.componentInstance);

	    this.componentInstance.setState = function () {
	      throw new Error("This component is managed by `" + pkgName + "`. You should dispatch action to mutate component state.");
	    };

	    this.storeListenerUnsubscribe = this.store.subscribe(this.storeListener);
	    this.componentInstance[COMPONENT_MANAGER_LOCAL_KEY] = this;

	    if (this.isServerSideRendering) {
	      this.init();
	    } else {
	      injectLifeHookers.apply(this);
	    }
	  };

	  _proto.dispatch = function dispatch(action, relativeDispatchPath) {
	    if (relativeDispatchPath === void 0) {
	      relativeDispatchPath = "";
	    }

	    var pc = new PathContext(this.fullPath);
	    var namespacedAction = pc.convertNamespacedAction(action, relativeDispatchPath); // --- query action Type's original namespace so that it can be serialised correctly if needed

	    var namespace = this.appContainer.actionRegistry.findNamespaceByActionType(namespacedAction.type);

	    if (!namespace) {
	      log$1("Cannot locate namespace for Action `" + newAction.type + "`: `" + newAction.type + "` needs to be registered otherwise the action won't be serializable.");
	    } else {
	      namespacedAction.namespace = namespace;
	    }

	    return this.store.dispatch(namespacedAction);
	  };

	  _proto.init = function init() {
	    if (this.isInitialized || this.isDestroyed) return;
	    this.initCallback(this);
	    this.isInitialized = true;
	  };

	  _proto.destroy = function destroy() {
	    this.isDestroyed = true;
	    if (!this.isInitialized) return;
	    this.destroyCallback(this);

	    if (this.storeListenerUnsubscribe) {
	      this.storeListenerUnsubscribe();
	      this.storeListenerUnsubscribe = null;
	    }

	    this.appContainer = null;
	    this.store = null;
	    this.isInitialized = false;
	  };

	  return ComponentManager;
	}();

	function bindStoreListener() {
	  var state = objectPath.get(this.store.getState(), this.fullPath.split("/"));
	  if (state === this.componentInstance.state) return;
	  this.setState(state);
	}

	function determineInitState() {
	  var initState = this.managingInstance.state;

	  if (!initState) {
	    initState = this.options.initState;
	  }

	  if (!initState) {
	    initState = {};
	  }

	  this.initState = _extends_1({}, initState);
	}

	function injectLifeHookers() {
	  var origComponentDidMount = this.managingInstance.componentDidMount ? this.managingInstance.componentDidMount : noop$1;
	  var origComponentWillUnmount = this.managingInstance.componentWillUnmount ? this.managingInstance.componentWillUnmount : noop$1;
	  this.managingInstance.componentDidMount = handlerComponentDidMount.bind(this, origComponentDidMount);
	  this.managingInstance.componentWillUnmount = handlerComponentWillUnmount.bind(this, origComponentWillUnmount);
	}

	function handlerComponentDidMount(originalHandler) {
	  this.init();

	  if (originalHandler && typeof originalHandler === "function") {
	    originalHandler.apply(this.managingInstance);
	  }
	}

	function handlerComponentWillUnmount(originalHandler) {
	  if (originalHandler && typeof originalHandler === "function") {
	    originalHandler.apply(this.managingInstance);
	  }

	  this.destroy();
	}

	function fullNamespace() {
	  var parts = [];
	  if (this.namespacePrefix) parts.push(this.namespacePrefix);
	  if (this.namespace) parts.push(this.namespace);
	  return parts.join("/");
	}

	function fullPath() {
	  var parts = [];
	  if (this.fullNamespace) parts.push(this.fullNamespace);
	  parts.push(this.componentId);
	  return parts.join("/");
	}

	function fullLocalPath() {
	  var parts = [];
	  if (this.namespace) parts.push(this.namespace);
	  parts.push(this.componentId);
	  return parts.join("/");
	}

	function getComponentName(componentInstance) {
	  try {
	    return componentInstance.constructor.displayName || componentInstance.constructor.name || "Component";
	  } catch (e) {
	    return "Compon";
	  }
	}

	function settleStringSetting(setting) {
	  if (!setting) return "";

	  if (typeof setting === "function") {
	    try {
	      var value = setting.bind(this, this.displayName, this.managingInstance)();
	      if (!value) return "";
	      return value;
	    } catch (e) {
	      console.log("Failed to retrieve setting via executing generating function: " + e.getMessage());
	      return "";
	    }
	  } else {
	    return String(setting);
	  }
	}

	var defaultOptions$1 = {
	  isServerSideRendering: false
	};

	var ComponentRegistry =
	/*#__PURE__*/
	function () {
	  function ComponentRegistry(appContainer, options) {
	    if (options === void 0) {
	      options = {};
	    }

	    this.appContainer = appContainer;
	    this.options = _extends_1({}, defaultOptions$1, options);
	    this.pathRegistry = new PathRegistry();
	    this.componentManagerStore = {};
	  }

	  var _proto = ComponentRegistry.prototype;

	  _proto.register = function register(componentInstance, options) {
	    var runTimeOptions = _extends_1({}, this.options, options);

	    var manager = new ComponentManager(componentInstance, runTimeOptions, this.appContainer);

	    if (this.componentManagerStore[manager.fullPath]) {
	      throw new Error("Try to register component to an existing path: " + manager.fullPath);
	    }

	    this.componentManagerStore[manager.fullPath] = manager;
	    manager.enhanceComponentInstance(registerComponentManager.bind(this), deRegisterComponentManager.bind(this));
	    this.appContainer.namespaceRegistry.registerComponentManager(manager);
	    return manager;
	  };

	  _proto.deregister = function deregister(componentInstance) {
	    var cm = componentInstance[COMPONENT_MANAGER_LOCAL_KEY];
	    if (!cm) return;
	    deRegisterComponentManager.call(this, cm);
	  };

	  _proto.destroy = function destroy() {
	    Object.values(this.componentManagerStore).map(function (cm) {
	      return cm.destroy();
	    });
	  };

	  return ComponentRegistry;
	}();

	function registerComponentManager(cm) {
	  if (cm.options.reducer && is$1.func(cm.options.reducer)) {
	    this.appContainer.reducerRegistry.register(cm.options.reducer.bind(cm.componentInstance), {
	      initState: cm.initState,
	      path: cm.fullPath,
	      namespace: cm.namespace,
	      persistState: cm.persistState,
	      allowedIncomingMulticastActionTypes: cm.allowedIncomingMulticastActionTypes
	    });
	  }

	  if (cm.options.saga && is$1.func(cm.options.saga)) {
	    this.appContainer.sagaRegistry.register(cm.options.saga.bind(cm.componentInstance), {
	      path: cm.fullPath,
	      namespace: cm.namespace,
	      allowedIncomingMulticastActionTypes: cm.allowedIncomingMulticastActionTypes
	    });
	  }
	}

	function deRegisterComponentManager(cm) {
	  if (cm.options.reducer && is$1.func(cm.options.reducer)) {
	    this.appContainer.sagaRegistry.deregister(cm.fullPath);
	  }

	  if (cm.options.saga && is$1.func(cm.options.saga)) {
	    this.appContainer.reducerRegistry.deregister(cm.fullPath);
	  }

	  this.appContainer.namespaceRegistry.deregisterComponentManager(cm);
	}

	var INIT_STATE =
	/*#__PURE__*/
	Symbol("@@" +
	/*#__PURE__*/
	getPackageName() + "/INIT_STATE");
	var EMPTY_STATE =
	/*#__PURE__*/
	Symbol("@@" +
	/*#__PURE__*/
	getPackageName() + "/EMPTY_STATE");

	var actionTypes = /*#__PURE__*/Object.freeze({
		INIT_STATE: INIT_STATE,
		EMPTY_STATE: EMPTY_STATE
	});

	var namespace = "io.github.t83714/" +
	/*#__PURE__*/
	getPackageName() + "/ReducerRegistry";

	var initState = function initState(path, data, persistState) {
	  return {
	    type: INIT_STATE,
	    namespace: namespace,
	    payload: {
	      path: path,
	      data: data,
	      persistState: persistState
	    }
	  };
	};
	var emptyState = function emptyState(path, data) {
	  return {
	    type: EMPTY_STATE,
	    namespace: namespace,
	    payload: {
	      path: path,
	      data: data
	    }
	  };
	};

	/*!
	 * isobject <https://github.com/jonschlinkert/isobject>
	 *
	 * Copyright (c) 2014-2017, Jon Schlinkert.
	 * Released under the MIT License.
	 */

	var isobject = function isObject(val) {
	  return val != null && typeof val === 'object' && Array.isArray(val) === false;
	};

	function isObjectObject(o) {
	  return isobject(o) === true
	    && Object.prototype.toString.call(o) === '[object Object]';
	}

	var isPlainObject$1 = function isPlainObject(o) {
	  var ctor,prot;

	  if (isObjectObject(o) === false) return false;

	  // If has modified constructor
	  ctor = o.constructor;
	  if (typeof ctor !== 'function') return false;

	  // If has modified prototype
	  prot = ctor.prototype;
	  if (isObjectObject(prot) === false) return false;

	  // If constructor does not have an Object-specific method
	  if (prot.hasOwnProperty('isPrototypeOf') === false) {
	    return false;
	  }

	  // Most likely a plain Object
	  return true;
	};

	var _hasOwnProperty = Object.prototype.hasOwnProperty;

	function isEmpty (value) {
	  if (isNumber(value)) {
	    return false
	  }
	  if (!value) {
	    return true
	  }
	  if (isArray(value) && value.length === 0) {
	    return true
	  } else if (!isString(value)) {
	    for (var i in value) {
	      if (_hasOwnProperty.call(value, i)) {
	        return false
	      }
	    }
	    return true
	  }
	  return false
	}

	function isNumber (value) {
	  return typeof value === 'number'
	}

	function isString (obj) {
	  return typeof obj === 'string'
	}

	function isArray (obj) {
	  return Array.isArray(obj)
	}

	function assignToObj (target, source) {
	  for (var key in source) {
	    if (_hasOwnProperty.call(source, key)) {
	      target[key] = source[key];
	    }
	  }
	  return target
	}

	function getKey (key) {
	  var intKey = parseInt(key);
	  if (intKey.toString() === key) {
	    return intKey
	  }
	  return key
	}

	var objectPathImmutable = function (src) {
	  var dest = src;
	  var committed = false;

	  var transaction = Object.keys(api).reduce(function (proxy, prop) {
	    /* istanbul ignore else */
	    if (typeof api[prop] === 'function') {
	      proxy[prop] = function () {
	        var args = [dest, src].concat(Array.prototype.slice.call(arguments));

	        if (committed) {
	          throw new Error('Cannot call ' + prop + ' after `value`')
	        }

	        dest = api[prop].apply(null, args);

	        return transaction
	      };
	    }

	    return proxy
	  }, {});

	  transaction.value = function () {
	    committed = true;
	    return dest
	  };

	  return transaction
	};

	function clone (obj, createIfEmpty, assumeArray) {
	  if (obj == null) {
	    if (createIfEmpty) {
	      if (assumeArray) {
	        return []
	      }

	      return {}
	    }

	    return obj
	  } else if (isArray(obj)) {
	    return obj.slice()
	  }

	  return assignToObj({}, obj)
	}

	function deepMerge (dest, src) {
	  if (dest !== src && isPlainObject$1(dest) && isPlainObject$1(src)) {
	    var merged = {};
	    for (var key in dest) {
	      if (dest.hasOwnProperty(key)) {
	        if (src.hasOwnProperty(key)) {
	          merged[key] = deepMerge(dest[key], src[key]);
	        } else {
	          merged[key] = dest[key];
	        }
	      }
	    }

	    for (key in src) {
	      if (src.hasOwnProperty(key)) {
	        merged[key] = deepMerge(dest[key], src[key]);
	      }
	    }
	    return merged
	  }
	  return src
	}

	function changeImmutable (dest, src, path, changeCallback) {
	  if (isNumber(path)) {
	    path = [path];
	  }
	  if (isEmpty(path)) {
	    return src
	  }
	  if (isString(path)) {
	    return changeImmutable(dest, src, path.split('.').map(getKey), changeCallback)
	  }
	  var currentPath = path[0];

	  if (!dest || dest === src) {
	    dest = clone(src, true, isNumber(currentPath));
	  }

	  if (path.length === 1) {
	    return changeCallback(dest, currentPath)
	  }

	  if (src != null) {
	    src = src[currentPath];
	  }

	  dest[currentPath] = changeImmutable(dest[currentPath], src, path.slice(1), changeCallback);

	  return dest
	}

	var api = {};
	api.set = function set (dest, src, path, value) {
	  if (isEmpty(path)) {
	    return value
	  }
	  return changeImmutable(dest, src, path, function (clonedObj, finalPath) {
	    clonedObj[finalPath] = value;
	    return clonedObj
	  })
	};

	api.update = function update (dest, src, path, updater) {
	  if (isEmpty(path)) {
	    return updater(clone(src))
	  }
	  return changeImmutable(dest, src, path, function (clonedObj, finalPath) {
	    clonedObj[finalPath] = updater(clonedObj[finalPath]);
	    return clonedObj
	  })
	};

	api.push = function push (dest, src, path /*, values */) {
	  var values = Array.prototype.slice.call(arguments, 3);
	  if (isEmpty(path)) {
	    if (!isArray(src)) {
	      return values
	    } else {
	      return src.concat(values)
	    }
	  }
	  return changeImmutable(dest, src, path, function (clonedObj, finalPath) {
	    if (!isArray(clonedObj[finalPath])) {
	      clonedObj[finalPath] = values;
	    } else {
	      clonedObj[finalPath] = clonedObj[finalPath].concat(values);
	    }
	    return clonedObj
	  })
	};

	api.insert = function insert (dest, src, path, value, at) {
	  at = ~~at;
	  if (isEmpty(path)) {
	    if (!isArray(src)) {
	      return [value]
	    }

	    var first = src.slice(0, at);
	    first.push(value);
	    return first.concat(src.slice(at))
	  }
	  return changeImmutable(dest, src, path, function (clonedObj, finalPath) {
	    var arr = clonedObj[finalPath];
	    if (!isArray(arr)) {
	      if (arr != null && typeof arr !== 'undefined') {
	        throw new Error('Expected ' + path + 'to be an array. Instead got ' + typeof path)
	      }
	      arr = [];
	    }

	    var first = arr.slice(0, at);
	    first.push(value);
	    clonedObj[finalPath] = first.concat(arr.slice(at));
	    return clonedObj
	  })
	};

	api.del = function del (dest, src, path) {
	  if (isEmpty(path)) {
	    return void 0
	  }
	  return changeImmutable(dest, src, path, function (clonedObj, finalPath) {
	    if (Array.isArray(clonedObj)) {
	      if (clonedObj[finalPath] !== undefined) {
	        clonedObj.splice(finalPath, 1);
	      }
	    } else {
	      if (clonedObj.hasOwnProperty(finalPath)) {
	        delete clonedObj[finalPath];
	      }
	    }
	    return clonedObj
	  })
	};

	api.assign = function assign (dest, src, path, source) {
	  if (isEmpty(path)) {
	    if (isEmpty(source)) {
	      return src
	    }
	    return assignToObj(clone(src), source)
	  }
	  return changeImmutable(dest, src, path, function (clonedObj, finalPath) {
	    source = Object(source);
	    var target = clone(clonedObj[finalPath], true);
	    assignToObj(target, source);

	    clonedObj[finalPath] = target;
	    return clonedObj
	  })
	};

	api.merge = function assign (dest, src, path, source) {
	  if (isEmpty(path)) {
	    if (isEmpty(source)) {
	      return src
	    }
	    return deepMerge(src, source)
	  }
	  return changeImmutable(dest, src, path, function (clonedObj, finalPath) {
	    source = Object(source);
	    clonedObj[finalPath] = deepMerge(clonedObj[finalPath], source);
	    return clonedObj
	  })
	};

	var objectPathImmutable_1 = Object.keys(api).reduce(function (objectPathImmutable, method) {
	  objectPathImmutable[method] = api[method].bind(null, null);

	  return objectPathImmutable
	}, objectPathImmutable);

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	var _arrayMap = arrayMap;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	var _freeGlobal = freeGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root$1 = _freeGlobal || freeSelf || Function('return this')();

	var _root = root$1;

	/** Built-in value references. */
	var Symbol$1 = _root.Symbol;

	var _Symbol = Symbol$1;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$1 = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	var _getRawTag = getRawTag;

	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString$1 = objectProto$1.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString$1.call(value);
	}

	var _objectToString = objectToString;

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag$1 && symToStringTag$1 in Object(value))
	    ? _getRawTag(value)
	    : _objectToString(value);
	}

	var _baseGetTag = baseGetTag;

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	var isObject_1 = isObject;

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject_1(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = _baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	var isFunction_1 = isFunction;

	/** Used to detect overreaching core-js shims. */
	var coreJsData = _root['__core-js_shared__'];

	var _coreJsData = coreJsData;

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	var _isMasked = isMasked;

	/** Used for built-in method references. */
	var funcProto = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	var _toSource = toSource;

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto$1 = Function.prototype,
	    objectProto$2 = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$1 = funcProto$1.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString$1.call(hasOwnProperty$2).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject_1(value) || _isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(_toSource(value));
	}

	var _baseIsNative = baseIsNative;

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	var _getValue = getValue;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = _getValue(object, key);
	  return _baseIsNative(value) ? value : undefined;
	}

	var _getNative = getNative;

	/* Built-in method references that are verified to be native. */
	var nativeCreate = _getNative(Object, 'create');

	var _nativeCreate = nativeCreate;

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
	  this.size = 0;
	}

	var _hashClear = hashClear;

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _hashDelete = hashDelete;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto$3 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (_nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty$3.call(data, key) ? data[key] : undefined;
	}

	var _hashGet = hashGet;

	/** Used for built-in method references. */
	var objectProto$4 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$4 = objectProto$4.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$4.call(data, key);
	}

	var _hashHas = hashHas;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
	  return this;
	}

	var _hashSet = hashSet;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = _hashClear;
	Hash.prototype['delete'] = _hashDelete;
	Hash.prototype.get = _hashGet;
	Hash.prototype.has = _hashHas;
	Hash.prototype.set = _hashSet;

	var _Hash = Hash;

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}

	var _listCacheClear = listCacheClear;

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	var eq_1 = eq;

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq_1(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	var _assocIndexOf = assocIndexOf;

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}

	var _listCacheDelete = listCacheDelete;

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	var _listCacheGet = listCacheGet;

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return _assocIndexOf(this.__data__, key) > -1;
	}

	var _listCacheHas = listCacheHas;

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	var _listCacheSet = listCacheSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = _listCacheClear;
	ListCache.prototype['delete'] = _listCacheDelete;
	ListCache.prototype.get = _listCacheGet;
	ListCache.prototype.has = _listCacheHas;
	ListCache.prototype.set = _listCacheSet;

	var _ListCache = ListCache;

	/* Built-in method references that are verified to be native. */
	var Map = _getNative(_root, 'Map');

	var _Map = Map;

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new _Hash,
	    'map': new (_Map || _ListCache),
	    'string': new _Hash
	  };
	}

	var _mapCacheClear = mapCacheClear;

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	var _isKeyable = isKeyable;

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return _isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	var _getMapData = getMapData;

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  var result = _getMapData(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _mapCacheDelete = mapCacheDelete;

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return _getMapData(this, key).get(key);
	}

	var _mapCacheGet = mapCacheGet;

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return _getMapData(this, key).has(key);
	}

	var _mapCacheHas = mapCacheHas;

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  var data = _getMapData(this, key),
	      size = data.size;

	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}

	var _mapCacheSet = mapCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = _mapCacheClear;
	MapCache.prototype['delete'] = _mapCacheDelete;
	MapCache.prototype.get = _mapCacheGet;
	MapCache.prototype.has = _mapCacheHas;
	MapCache.prototype.set = _mapCacheSet;

	var _MapCache = MapCache;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED$2);
	  return this;
	}

	var _setCacheAdd = setCacheAdd;

	/**
	 * Checks if `value` is in the array cache.
	 *
	 * @private
	 * @name has
	 * @memberOf SetCache
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `true` if `value` is found, else `false`.
	 */
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}

	var _setCacheHas = setCacheHas;

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values == null ? 0 : values.length;

	  this.__data__ = new _MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
	SetCache.prototype.has = _setCacheHas;

	var _SetCache = SetCache;

	/**
	 * The base implementation of `_.findIndex` and `_.findLastIndex` without
	 * support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} predicate The function invoked per iteration.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseFindIndex(array, predicate, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 1 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    if (predicate(array[index], index, array)) {
	      return index;
	    }
	  }
	  return -1;
	}

	var _baseFindIndex = baseFindIndex;

	/**
	 * The base implementation of `_.isNaN` without support for number objects.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
	 */
	function baseIsNaN(value) {
	  return value !== value;
	}

	var _baseIsNaN = baseIsNaN;

	/**
	 * A specialized version of `_.indexOf` which performs strict equality
	 * comparisons of values, i.e. `===`.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function strictIndexOf(array, value, fromIndex) {
	  var index = fromIndex - 1,
	      length = array.length;

	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}

	var _strictIndexOf = strictIndexOf;

	/**
	 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  return value === value
	    ? _strictIndexOf(array, value, fromIndex)
	    : _baseFindIndex(array, _baseIsNaN, fromIndex);
	}

	var _baseIndexOf = baseIndexOf;

	/**
	 * A specialized version of `_.includes` for arrays without support for
	 * specifying an index to search from.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludes(array, value) {
	  var length = array == null ? 0 : array.length;
	  return !!length && _baseIndexOf(array, value, 0) > -1;
	}

	var _arrayIncludes = arrayIncludes;

	/**
	 * This function is like `arrayIncludes` except that it accepts a comparator.
	 *
	 * @private
	 * @param {Array} [array] The array to inspect.
	 * @param {*} target The value to search for.
	 * @param {Function} comparator The comparator invoked per element.
	 * @returns {boolean} Returns `true` if `target` is found, else `false`.
	 */
	function arrayIncludesWith(array, value, comparator) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (comparator(value, array[index])) {
	      return true;
	    }
	  }
	  return false;
	}

	var _arrayIncludesWith = arrayIncludesWith;

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	var _baseUnary = baseUnary;

	/**
	 * Checks if a `cache` value for `key` exists.
	 *
	 * @private
	 * @param {Object} cache The cache to query.
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function cacheHas(cache, key) {
	  return cache.has(key);
	}

	var _cacheHas = cacheHas;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMin = Math.min;

	/**
	 * The base implementation of methods like `_.intersection`, without support
	 * for iteratee shorthands, that accepts an array of arrays to inspect.
	 *
	 * @private
	 * @param {Array} arrays The arrays to inspect.
	 * @param {Function} [iteratee] The iteratee invoked per element.
	 * @param {Function} [comparator] The comparator invoked per element.
	 * @returns {Array} Returns the new array of shared values.
	 */
	function baseIntersection(arrays, iteratee, comparator) {
	  var includes = comparator ? _arrayIncludesWith : _arrayIncludes,
	      length = arrays[0].length,
	      othLength = arrays.length,
	      othIndex = othLength,
	      caches = Array(othLength),
	      maxLength = Infinity,
	      result = [];

	  while (othIndex--) {
	    var array = arrays[othIndex];
	    if (othIndex && iteratee) {
	      array = _arrayMap(array, _baseUnary(iteratee));
	    }
	    maxLength = nativeMin(array.length, maxLength);
	    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
	      ? new _SetCache(othIndex && array)
	      : undefined;
	  }
	  array = arrays[0];

	  var index = -1,
	      seen = caches[0];

	  outer:
	  while (++index < length && result.length < maxLength) {
	    var value = array[index],
	        computed = iteratee ? iteratee(value) : value;

	    value = (comparator || value !== 0) ? value : 0;
	    if (!(seen
	          ? _cacheHas(seen, computed)
	          : includes(result, computed, comparator)
	        )) {
	      othIndex = othLength;
	      while (--othIndex) {
	        var cache = caches[othIndex];
	        if (!(cache
	              ? _cacheHas(cache, computed)
	              : includes(arrays[othIndex], computed, comparator))
	            ) {
	          continue outer;
	        }
	      }
	      if (seen) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	  }
	  return result;
	}

	var _baseIntersection = baseIntersection;

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity$2(value) {
	  return value;
	}

	var identity_1 = identity$2;

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply$1(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}

	var _apply = apply$1;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);

	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return _apply(func, this, otherArgs);
	  };
	}

	var _overRest = overRest;

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	var constant_1 = constant;

	var defineProperty = (function() {
	  try {
	    var func = _getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());

	var _defineProperty = defineProperty;

	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
	  return _defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant_1(string),
	    'writable': true
	  });
	};

	var _baseSetToString = baseSetToString;

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800,
	    HOT_SPAN = 16;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;

	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;

	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);

	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}

	var _shortOut = shortOut;

	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = _shortOut(_baseSetToString);

	var _setToString = setToString;

	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return _setToString(_overRest(func, start, identity_1), func + '');
	}

	var _baseRest = baseRest;

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	var isLength_1 = isLength;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength_1(value.length) && !isFunction_1(value);
	}

	var isArrayLike_1 = isArrayLike;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	var isObjectLike_1 = isObjectLike;

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike_1(value) && isArrayLike_1(value);
	}

	var isArrayLikeObject_1 = isArrayLikeObject;

	/**
	 * Casts `value` to an empty array if it's not an array like object.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {Array|Object} Returns the cast array-like object.
	 */
	function castArrayLikeObject(value) {
	  return isArrayLikeObject_1(value) ? value : [];
	}

	var _castArrayLikeObject = castArrayLikeObject;

	/**
	 * Creates an array of unique values that are included in all given arrays
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons. The order and references of result values are
	 * determined by the first array.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Array
	 * @param {...Array} [arrays] The arrays to inspect.
	 * @returns {Array} Returns the new array of intersecting values.
	 * @example
	 *
	 * _.intersection([2, 1], [2, 3]);
	 * // => [2]
	 */
	var intersection = _baseRest(function(arrays) {
	  var mapped = _arrayMap(arrays, _castArrayLikeObject);
	  return (mapped.length && mapped[0] === arrays[0])
	    ? _baseIntersection(mapped)
	    : [];
	});

	var intersection_1 = intersection;

	var defaultReducerOptions = {
	  initState: {},
	  persistState: false
	};
	/**
	 * This function should NOT return a new state copy
	 */

	function processInitState(state, action) {
	  var _action$payload = action.payload,
	      data = _action$payload.data,
	      persistState = _action$payload.persistState,
	      path = _action$payload.path;
	  var pathItems = path.split("/");
	  var doNotReplace = persistState;
	  var hasData = objectPath.has(state, pathItems);

	  if (hasData) {
	    if (doNotReplace) {
	      var existingData = objectPath.get(state, pathItems);

	      if (intersection_1(Object.keys(existingData), Object.keys(data)).length) {
	        //--- has initilised
	        return state;
	      }
	    }
	  }

	  return objectPathImmutable_1.assign(state, pathItems, data);
	}
	/**
	 * This function should NOT return a new state copy
	 */


	function processEmptyState(state, action) {
	  var _action$payload2 = action.payload,
	      path = _action$payload2.path,
	      data = _action$payload2.data;
	  var pathItems = path.split("/");
	  return objectPathImmutable_1.update(state, pathItems, function (targetState) {
	    Object.keys(data).forEach(function (key) {
	      delete targetState[key];
	    });
	    return targetState;
	  });
	}

	function processNamespacedAction(state, action) {
	  var _this = this;

	  if (!is$1.namespacedAction(action)) return state;
	  var matchedPaths = this.pathRegistry.searchDispatchPaths(action);
	  if (!matchedPaths || !matchedPaths.length) return state;
	  var newState = state;
	  matchedPaths.forEach(function (p) {
	    var reducer = _this.reducerStore[p].reducer;
	    if (!reducer || typeof reducer !== "function") return;
	    var pathItems = p.split("/");
	    var componentState = objectPath.get(state, pathItems);
	    var newComponentState = reducer(componentState, action);

	    if (componentState === newComponentState) {
	      //--- skip update when no changes; likely not interested action
	      return;
	    } else {
	      newState = objectPathImmutable_1.assign(newState, pathItems, newComponentState);
	    }
	  });
	  return newState;
	}

	function globalReducer(externalGlobalReducer, state, action) {
	  if (!is$1.action(action)) return state;
	  var newState = state;

	  switch (action.type) {
	    case INIT_STATE:
	      newState = processInitState(newState, action);
	      break;

	    case EMPTY_STATE:
	      newState = processEmptyState(newState, action);
	      break;
	  }

	  newState = processNamespacedAction.call(this, newState, action);

	  if (externalGlobalReducer && typeof externalGlobalReducer === "function") {
	    newState = externalGlobalReducer(newState, action);
	  }

	  return newState;
	}

	var ReducerRegistry =
	/*#__PURE__*/
	function () {
	  function ReducerRegistry(appContainer) {
	    this.appContainer = appContainer;
	    this.reducerStore = {};
	    this.pathRegistry = new PathRegistry();
	    this.appContainer.actionRegistry.register(namespace, actionTypes);
	  }

	  var _proto = ReducerRegistry.prototype;

	  _proto.createGlobalReducer = function createGlobalReducer(externalGlobalReducer) {
	    if (externalGlobalReducer === void 0) {
	      externalGlobalReducer = null;
	    }

	    return globalReducer.bind(this, externalGlobalReducer);
	  };

	  _proto.register = function register(reducer, reducerOptions) {
	    if (!reducer || typeof reducer !== "function") throw new Error("Failed to register reducer: invalid reducer parameter.");
	    if (!reducerOptions) reducerOptions = _extends_1({}, defaultReducerOptions);
	    var _reducerOptions = reducerOptions,
	        path = _reducerOptions.path,
	        namespace$$1 = _reducerOptions.namespace,
	        initState$$1 = _reducerOptions.initState,
	        persistState = _reducerOptions.persistState,
	        allowedIncomingMulticastActionTypes = _reducerOptions.allowedIncomingMulticastActionTypes;
	    if (!path) throw new Error("Failed to register namespaced reducer: namespace path cannot be empty!");
	    var registeredPath = normalize(path);
	    var localPathPos = namespace$$1 ? registeredPath.lastIndexOf(namespace$$1) : registeredPath.length;

	    if (this.pathRegistry.add(registeredPath, {
	      localPathPos: localPathPos,
	      namespace: namespace$$1,
	      allowedIncomingMulticastActionTypes: allowedIncomingMulticastActionTypes
	    }) === null) {
	      throw new Error("Failed to register namespaced reducer: given path `" + registeredPath + "` has been registered.");
	    }

	    this.reducerStore[registeredPath] = _extends_1({}, reducerOptions, {
	      reducer: reducer,
	      initState: initState$$1,
	      persistState: persistState,
	      allowedIncomingMulticastActionTypes: allowedIncomingMulticastActionTypes,
	      path: registeredPath
	    });
	    setInitState.call(this, registeredPath, initState$$1, persistState);
	  };

	  _proto.deregister = function deregister(path) {
	    var normalizedPath = normalize(path);
	    this.pathRegistry.remove(normalizedPath);
	    var reduceItem = this.reducerStore[normalizedPath];
	    if (!reduceItem) return;
	    delete this.reducerStore[normalizedPath];
	    var persistState = reduceItem.persistState,
	        initState$$1 = reduceItem.initState;
	    if (persistState) return;
	    emptyInitState.call(this, normalizedPath, initState$$1);
	  };

	  return ReducerRegistry;
	}();

	function setInitState(path, initState$$1, persistState) {
	  if (!this.appContainer.store) throw new Error("Failed to set init state for component reducer: redux store not available yet!");
	  this.appContainer.store.dispatch(initState(path, initState$$1, persistState));
	}

	function emptyInitState(path, initState$$1) {
	  if (!this.appContainer.store) throw new Error("Failed to set init state for component reducer: redux store not available yet!");
	  this.appContainer.store.dispatch(emptyState(path, initState$$1));
	}

	var runtime = createCommonjsModule(function (module) {
	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	!(function(global) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }

	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = module.exports;

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []);

	    // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.
	    generator._invoke = makeInvokeMethod(innerFn, self, context);

	    return generator;
	  }
	  runtime.wrap = wrap;

	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";

	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};

	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}

	  // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.
	  var IteratorPrototype = {};
	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  if (NativeIteratorPrototype &&
	      NativeIteratorPrototype !== Op &&
	      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype =
	    Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] =
	    GeneratorFunction.displayName = "GeneratorFunction";

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      prototype[method] = function(arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };

	  runtime.mark = function(genFun) {
	    if (Object.setPrototypeOf) {
	      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
	    } else {
	      genFun.__proto__ = GeneratorFunctionPrototype;
	      if (!(toStringTagSymbol in genFun)) {
	        genFun[toStringTagSymbol] = "GeneratorFunction";
	      }
	    }
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };

	  // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.
	  runtime.awrap = function(arg) {
	    return { __await: arg };
	  };

	  function AsyncIterator(generator) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;
	        if (value &&
	            typeof value === "object" &&
	            hasOwn.call(value, "__await")) {
	          return Promise.resolve(value.__await).then(function(value) {
	            invoke("next", value, resolve, reject);
	          }, function(err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return Promise.resolve(value).then(function(unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration.
	          result.value = unwrapped;
	          resolve(result);
	        }, function(error) {
	          // If a rejected Promise was yielded, throw the rejection back
	          // into the async generator function so it can be handled there.
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new Promise(function(resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise =
	        // If enqueue has been called before, then we want to wait until
	        // all previous Promises have been resolved before calling invoke,
	        // so that results are always delivered in the correct order. If
	        // enqueue has not been called before, then it is important to
	        // call invoke immediately, without waiting on a callback to fire,
	        // so that the async generator function has the opportunity to do
	        // any necessary setup in a predictable way. This predictability
	        // is why the Promise constructor synchronously invokes its
	        // executor callback, and why async functions synchronously
	        // execute code before the first await. Since we implement simple
	        // async functions in terms of async generators, it is especially
	        // important to get this right, even though it requires care.
	        previousPromise ? previousPromise.then(
	          callInvokeWithMethodAndArg,
	          // Avoid propagating failures to Promises returned by later
	          // invocations of the iterator.
	          callInvokeWithMethodAndArg
	        ) : callInvokeWithMethodAndArg();
	    }

	    // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).
	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);
	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };
	  runtime.AsyncIterator = AsyncIterator;

	  // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    var iter = new AsyncIterator(
	      wrap(innerFn, outerFn, self, tryLocsList)
	    );

	    return runtime.isGeneratorFunction(outerFn)
	      ? iter // If outerFn is a generator, return the full iterator.
	      : iter.next().then(function(result) {
	          return result.done ? result.value : iter.next();
	        });
	  };

	  function makeInvokeMethod(innerFn, self, context) {
	    var state = GenStateSuspendedStart;

	    return function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }

	      if (state === GenStateCompleted) {
	        if (method === "throw") {
	          throw arg;
	        }

	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }

	      context.method = method;
	      context.arg = arg;

	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var delegateResult = maybeInvokeDelegate(delegate, context);
	          if (delegateResult) {
	            if (delegateResult === ContinueSentinel) continue;
	            return delegateResult;
	          }
	        }

	        if (context.method === "next") {
	          // Setting context._sent for legacy support of Babel's
	          // function.sent implementation.
	          context.sent = context._sent = context.arg;

	        } else if (context.method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw context.arg;
	          }

	          context.dispatchException(context.arg);

	        } else if (context.method === "return") {
	          context.abrupt("return", context.arg);
	        }

	        state = GenStateExecuting;

	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };

	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	          // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.
	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  }

	  // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (method === undefined) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        if (delegate.iterator.return) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError(
	          "The iterator does not provide a 'throw' method");
	      }

	      return ContinueSentinel;
	    }

	    var record = tryCatch(method, delegate.iterator, context.arg);

	    if (record.type === "throw") {
	      context.method = "throw";
	      context.arg = record.arg;
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    var info = record.arg;

	    if (! info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value;

	      // Resume execution at the desired location (see delegateYield).
	      context.next = delegate.nextLoc;

	      // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.
	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined;
	      }

	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    }

	    // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.
	    context.delegate = null;
	    return ContinueSentinel;
	  }

	  // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.
	  defineIteratorMethods(Gp);

	  Gp[toStringTagSymbol] = "Generator";

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };

	  Gp.toString = function() {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };

	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }

	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }

	    this.tryEntries.push(entry);
	  }

	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }

	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();

	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }

	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };

	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }

	      if (typeof iterable.next === "function") {
	        return iterable;
	      }

	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined;
	          next.done = true;

	          return next;
	        };

	        return next.next = next;
	      }
	    }

	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;

	  function doneResult() {
	    return { value: undefined, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined;
	          }
	        }
	      }
	    },

	    stop: function() {
	      this.done = true;

	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },

	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }

	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;

	        if (caught) {
	          // If the dispatched exception was caught by a catch block,
	          // then let that catch block handle the exception normally.
	          context.method = "next";
	          context.arg = undefined;
	        }

	        return !! caught;
	      }

	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;

	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }

	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");

	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }

	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }

	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },

	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg <= finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }

	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;

	      if (finallyEntry) {
	        this.method = "next";
	        this.next = finallyEntry.finallyLoc;
	        return ContinueSentinel;
	      }

	      return this.complete(record);
	    },

	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = this.arg = record.arg;
	        this.method = "return";
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }

	      return ContinueSentinel;
	    },

	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },

	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }

	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },

	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined;
	      }

	      return ContinueSentinel;
	    }
	  };
	})(
	  // In sloppy mode, unbound `this` refers to the global object, fallback to
	  // Function constructor if we're in global strict mode. That is sadly a form
	  // of indirect eval which violates Content Security Policy.
	  (function() {
	    return this || (typeof self === "object" && self);
	  })() || Function("return this")()
	);
	});

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	// This method of obtaining a reference to the global object needs to be
	// kept identical to the way it is obtained in runtime.js
	var g = (function() {
	  return this || (typeof self === "object" && self);
	})() || Function("return this")();

	// Use `getOwnPropertyNames` because not all browsers support calling
	// `hasOwnProperty` on the global `self` object in a worker. See #183.
	var hadRuntime = g.regeneratorRuntime &&
	  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

	// Save the old regeneratorRuntime in case it needs to be restored later.
	var oldRuntime = hadRuntime && g.regeneratorRuntime;

	// Force reevalutation of runtime.js.
	g.regeneratorRuntime = undefined;

	var runtimeModule = runtime;

	if (hadRuntime) {
	  // Restore the original runtime.
	  g.regeneratorRuntime = oldRuntime;
	} else {
	  // Remove the global property added by runtime.js.
	  try {
	    delete g.regeneratorRuntime;
	  } catch(e) {
	    g.regeneratorRuntime = undefined;
	  }
	}

	var regenerator = runtimeModule;

	var INIT_SAGA =
	/*#__PURE__*/
	Symbol("@@" +
	/*#__PURE__*/
	getPackageName() + "/INIT_SAGA");
	var CANCEL_SAGA =
	/*#__PURE__*/
	Symbol("@@" +
	/*#__PURE__*/
	getPackageName() + "/CANCEL_SAGA");

	var actionTypes$1 = /*#__PURE__*/Object.freeze({
		INIT_SAGA: INIT_SAGA,
		CANCEL_SAGA: CANCEL_SAGA
	});

	var namespace$1 = "io.github.t83714/" +
	/*#__PURE__*/
	getPackageName() + "/SagaRegistry";

	var initSaga = function initSaga(sagaItem) {
	  return {
	    type: INIT_SAGA,
	    namespace: namespace$1,
	    payload: sagaItem
	  };
	};
	var cancelSaga = function cancelSaga(pathOrTask) {
	  return {
	    type: CANCEL_SAGA,
	    namespace: namespace$1,
	    payload: pathOrTask
	  };
	};

	var EventChannel =
	/*#__PURE__*/
	function () {
	  function EventChannel(buffer) {
	    if (buffer === void 0) {
	      buffer = null;
	    }

	    if (!buffer) {
	      this.buffer = expanding();
	    } else {
	      this.buffer = buffer;
	    }

	    this.eventEmitters = [];
	  }

	  var _proto = EventChannel.prototype;

	  _proto.subscribe = function subscribe(emitter) {
	    this.unsubscribe(emitter);
	    this.eventEmitters.push(emitter);
	  };

	  _proto.unsubscribe = function unsubscribe(emitter) {
	    this.eventEmitters = this.eventEmitters.filter(function (item) {
	      return item !== emitter;
	    });
	  };

	  _proto.dispatch = function dispatch(event) {
	    this.eventEmitters.forEach(function (emitter) {
	      return emitter(event);
	    });
	  };

	  _proto.destroy = function destroy() {
	    this.eventEmitters = [];
	  };

	  _proto.create = function create(matcher) {
	    var _this = this;

	    return eventChannel(function (emitter) {
	      _this.subscribe(emitter);

	      return function () {
	        _this.unsubscribe(emitter);
	      };
	    }, this.buffer, matcher ? matcher : kTrue$1);
	  };

	  return EventChannel;
	}();

	function take$1(sagaItem, pattern) {
	  var chan = sagaItem.chan;
	  return take(chan, pattern);
	}
	function put$1(sagaItem, action, relativeDispatchPath) {
	  if (relativeDispatchPath === void 0) {
	    relativeDispatchPath = "";
	  }

	  var path = sagaItem.path;
	  var pc = new PathContext(path);
	  var namespacedAction = pc.convertNamespacedAction(action, relativeDispatchPath); // --- query action Type's original namespace so that it can be serialised correctly if needed

	  var namespace = this.appContainer.actionRegistry.findNamespaceByActionType(namespacedAction.type);

	  if (!namespace) {
	    log$1("Cannot locate namespace for Action `" + newAction.type + "`: `" + newAction.type + "` needs to be registered otherwise the action won't be serializable.");
	  } else {
	    namespacedAction.namespace = namespace;
	  }

	  return put(namespacedAction);
	}
	function select$1(sagaItem, selector) {
	  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    args[_key - 2] = arguments[_key];
	  }

	  var path = sagaItem.path;
	  var pathItems = path.split("/");
	  return select(function (state) {
	    var namespacedState = objectPath.get(state, pathItems);

	    if (selector && is$1.func(selector)) {
	      return selector.apply(void 0, [namespacedState].concat(args));
	    }

	    return namespacedState;
	  });
	}
	var takeEvery$2 = function takeEvery(sagaItem, pattern, saga) {
	  for (var _len2 = arguments.length, args = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
	    args[_key2 - 3] = arguments[_key2];
	  }

	  return fork(
	  /*#__PURE__*/
	  regenerator.mark(function _callee() {
	    var action;
	    return regenerator.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:

	            _context.next = 3;
	            return take$1(sagaItem, pattern);

	          case 3:
	            action = _context.sent;
	            _context.next = 6;
	            return fork.apply(void 0, [saga].concat(args.concat(action)));

	          case 6:
	            _context.next = 0;
	            break;

	          case 8:
	          case "end":
	            return _context.stop();
	        }
	      }
	    }, _callee, this);
	  }));
	};
	var takeLatest$2 = function takeLatest(sagaItem, pattern, saga) {
	  for (var _len3 = arguments.length, args = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
	    args[_key3 - 3] = arguments[_key3];
	  }

	  return fork(
	  /*#__PURE__*/
	  regenerator.mark(function _callee2() {
	    var lastTask, action;
	    return regenerator.wrap(function _callee2$(_context2) {
	      while (1) {
	        switch (_context2.prev = _context2.next) {
	          case 0:

	            _context2.next = 3;
	            return take$1(sagaItem, pattern);

	          case 3:
	            action = _context2.sent;

	            if (!lastTask) {
	              _context2.next = 7;
	              break;
	            }

	            _context2.next = 7;
	            return cancel(lastTask);

	          case 7:
	            _context2.next = 9;
	            return fork.apply(void 0, [saga].concat(args.concat(action)));

	          case 9:
	            lastTask = _context2.sent;
	            _context2.next = 0;
	            break;

	          case 12:
	          case "end":
	            return _context2.stop();
	        }
	      }
	    }, _callee2, this);
	  }));
	};
	var takeLeading$2 = function takeLeading(sagaItem, pattern, saga) {
	  for (var _len4 = arguments.length, args = new Array(_len4 > 3 ? _len4 - 3 : 0), _key4 = 3; _key4 < _len4; _key4++) {
	    args[_key4 - 3] = arguments[_key4];
	  }

	  return fork(
	  /*#__PURE__*/
	  regenerator.mark(function _callee3() {
	    var action;
	    return regenerator.wrap(function _callee3$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:

	            _context3.next = 3;
	            return take$1(sagaItem, pattern);

	          case 3:
	            action = _context3.sent;
	            _context3.next = 6;
	            return call.apply(void 0, [saga].concat(args.concat(action)));

	          case 6:
	            _context3.next = 0;
	            break;

	          case 8:
	          case "end":
	            return _context3.stop();
	        }
	      }
	    }, _callee3, this);
	  }));
	};
	var throttle$2 = function throttle(sagaItem, ms, pattern, task) {
	  for (var _len5 = arguments.length, args = new Array(_len5 > 4 ? _len5 - 4 : 0), _key5 = 4; _key5 < _len5; _key5++) {
	    args[_key5 - 4] = arguments[_key5];
	  }

	  return fork(
	  /*#__PURE__*/
	  regenerator.mark(function _callee5() {
	    var throttleChannel, action;
	    return regenerator.wrap(function _callee5$(_context5) {
	      while (1) {
	        switch (_context5.prev = _context5.next) {
	          case 0:
	            _context5.next = 2;
	            return call(channel, sliding(1));

	          case 2:
	            throttleChannel = _context5.sent;
	            _context5.next = 5;
	            return takeEvery$2(sagaItem, "*",
	            /*#__PURE__*/
	            regenerator.mark(function _callee4(action) {
	              return regenerator.wrap(function _callee4$(_context4) {
	                while (1) {
	                  switch (_context4.prev = _context4.next) {
	                    case 0:
	                      _context4.next = 2;
	                      return put(throttleChannel, action);

	                    case 2:
	                    case "end":
	                      return _context4.stop();
	                  }
	                }
	              }, _callee4, this);
	            }));

	          case 5:

	            _context5.next = 8;
	            return take(throttleChannel);

	          case 8:
	            action = _context5.sent;
	            _context5.next = 11;
	            return fork.apply(void 0, [task].concat(args, [action]));

	          case 11:
	            _context5.next = 13;
	            return delay$1(ms);

	          case 13:
	            _context5.next = 5;
	            break;

	          case 15:
	          case "end":
	            return _context5.stop();
	        }
	      }
	    }, _callee5, this);
	  }));
	};
	var actionChannel$1 = function actionChannel$$1(sagaItem, pattern, buffer) {
	  return call(
	  /*#__PURE__*/
	  regenerator.mark(function _callee7() {
	    var chan, bufferChan;
	    return regenerator.wrap(function _callee7$(_context7) {
	      while (1) {
	        switch (_context7.prev = _context7.next) {
	          case 0:
	            chan = sagaItem.chan;
	            _context7.next = 3;
	            return call(channel, buffer);

	          case 3:
	            bufferChan = _context7.sent;
	            _context7.prev = 4;
	            _context7.next = 7;
	            return fork(
	            /*#__PURE__*/
	            regenerator.mark(function _callee6() {
	              var action;
	              return regenerator.wrap(function _callee6$(_context6) {
	                while (1) {
	                  switch (_context6.prev = _context6.next) {
	                    case 0:

	                      _context6.next = 3;
	                      return take$1(chan, pattern);

	                    case 3:
	                      action = _context6.sent;
	                      _context6.next = 6;
	                      return put$1(bufferChan, action);

	                    case 6:
	                      _context6.next = 0;
	                      break;

	                    case 8:
	                    case "end":
	                      return _context6.stop();
	                  }
	                }
	              }, _callee6, this);
	            }));

	          case 7:
	            _context7.prev = 7;
	            if (bufferChan) bufferChan.close();
	            return _context7.finish(7);

	          case 10:
	            return _context7.abrupt("return", bufferChan);

	          case 11:
	          case "end":
	            return _context7.stop();
	        }
	      }
	    }, _callee7, this, [[4,, 7, 10]]);
	  }));
	};

	var namespacedEffects = /*#__PURE__*/Object.freeze({
		take: take$1,
		put: put$1,
		select: select$1,
		takeEvery: takeEvery$2,
		takeLatest: takeLatest$2,
		takeLeading: takeLeading$2,
		throttle: throttle$2,
		actionChannel: actionChannel$1
	});

	var _marked =
	/*#__PURE__*/
	regenerator.mark(hostSaga),
	    _marked2 =
	/*#__PURE__*/
	regenerator.mark(startCommandChan),
	    _marked3 =
	/*#__PURE__*/
	regenerator.mark(processCommandAction),
	    _marked4 =
	/*#__PURE__*/
	regenerator.mark(initSaga$1),
	    _marked5 =
	/*#__PURE__*/
	regenerator.mark(initGlobalSaga),
	    _marked6 =
	/*#__PURE__*/
	regenerator.mark(cancelSaga$1);

	function hostSaga() {
	  return regenerator.wrap(function hostSaga$(_context) {
	    while (1) {
	      switch (_context.prev = _context.next) {
	        case 0:
	          _context.next = 2;
	          return fork([this, startCommandChan]);

	        case 2:
	          _context.next = 4;
	          return fork([this, forwardNamespacedAction]);

	        case 4:
	        case "end":
	          return _context.stop();
	      }
	    }
	  }, _marked, this);
	}

	var forwardNamespacedAction =
	/*#__PURE__*/
	regenerator.mark(function forwardNamespacedAction() {
	  return regenerator.wrap(function forwardNamespacedAction$(_context3) {
	    while (1) {
	      switch (_context3.prev = _context3.next) {
	        case 0:
	          _context3.next = 2;
	          return takeEvery$1(function (action) {
	            return is$1.namespacedAction(action);
	          },
	          /*#__PURE__*/
	          regenerator.mark(function _callee(action) {
	            var matchedPaths, i, sagaItem;
	            return regenerator.wrap(function _callee$(_context2) {
	              while (1) {
	                switch (_context2.prev = _context2.next) {
	                  case 0:
	                    matchedPaths = this.pathRegistry.searchDispatchPaths(action);

	                    if (!(!matchedPaths || !matchedPaths.length)) {
	                      _context2.next = 3;
	                      break;
	                    }

	                    return _context2.abrupt("return");

	                  case 3:
	                    i = 0;

	                  case 4:
	                    if (!(i < matchedPaths.length)) {
	                      _context2.next = 13;
	                      break;
	                    }

	                    sagaItem = this.namespacedSagaItemStore[matchedPaths[i]];

	                    if (!(!sagaItem || !sagaItem.chan)) {
	                      _context2.next = 8;
	                      break;
	                    }

	                    return _context2.abrupt("continue", 10);

	                  case 8:
	                    _context2.next = 10;
	                    return put(sagaItem.chan, action);

	                  case 10:
	                    i++;
	                    _context2.next = 4;
	                    break;

	                  case 13:
	                  case "end":
	                    return _context2.stop();
	                }
	              }
	            }, _callee, this);
	          }).bind(this));

	        case 2:
	        case "end":
	          return _context3.stop();
	      }
	    }
	  }, forwardNamespacedAction, this);
	});

	function startCommandChan() {
	  var commandChan, action;
	  return regenerator.wrap(function startCommandChan$(_context4) {
	    while (1) {
	      switch (_context4.prev = _context4.next) {
	        case 0:
	          _context4.prev = 0;
	          _context4.next = 3;
	          return call([this.hostSagaCommandChan, this.hostSagaCommandChan.create]);

	        case 3:
	          commandChan = _context4.sent;

	        case 4:

	          _context4.next = 7;
	          return take(commandChan);

	        case 7:
	          action = _context4.sent;
	          _context4.next = 10;
	          return fork([this, processCommandAction], action);

	        case 10:
	          _context4.next = 4;
	          break;

	        case 12:
	          _context4.prev = 12;
	          _context4.next = 15;
	          return cancelled();

	        case 15:
	          if (!_context4.sent) {
	            _context4.next = 18;
	            break;
	          }

	          log$1("Terminating Global Host Saga Command Channel.");
	          commandChan.close();

	        case 18:
	          return _context4.finish(12);

	        case 19:
	        case "end":
	          return _context4.stop();
	      }
	    }
	  }, _marked2, this, [[0,, 12, 19]]);
	}

	function processCommandAction(_ref) {
	  var type, payload;
	  return regenerator.wrap(function processCommandAction$(_context5) {
	    while (1) {
	      switch (_context5.prev = _context5.next) {
	        case 0:
	          type = _ref.type, payload = _ref.payload;
	          _context5.t0 = type;
	          _context5.next = _context5.t0 === INIT_SAGA ? 4 : _context5.t0 === CANCEL_SAGA ? 7 : 10;
	          break;

	        case 4:
	          _context5.next = 6;
	          return call([this, initSaga$1], payload);

	        case 6:
	          return _context5.abrupt("break", 11);

	        case 7:
	          _context5.next = 9;
	          return call([this, cancelSaga$1], payload);

	        case 9:
	          return _context5.abrupt("break", 11);

	        case 10:
	          throw new Error("Unknown host command action: " + type);

	        case 11:
	        case "end":
	          return _context5.stop();
	      }
	    }
	  }, _marked3, this);
	}

	function initSaga$1(sagaItem) {
	  var _this = this;

	  var saga, path, namespace, allowedIncomingMulticastActionTypes, registeredPath, localPathPos, chan, newSagaItem, effects$$1, task, registerSagaItem;
	  return regenerator.wrap(function initSaga$(_context7) {
	    while (1) {
	      switch (_context7.prev = _context7.next) {
	        case 0:
	          saga = sagaItem.saga, path = sagaItem.path, namespace = sagaItem.namespace, allowedIncomingMulticastActionTypes = sagaItem.allowedIncomingMulticastActionTypes;
	          registeredPath = normalize(path);

	          if (registeredPath) {
	            _context7.next = 6;
	            break;
	          }

	          _context7.next = 5;
	          return call([this, initGlobalSaga], saga);

	        case 5:
	          return _context7.abrupt("return");

	        case 6:
	          localPathPos = namespace ? registeredPath.lastIndexOf(namespace) : registeredPath.length;

	          if (!(this.pathRegistry.add(registeredPath, {
	            localPathPos: localPathPos,
	            namespace: namespace,
	            allowedIncomingMulticastActionTypes: allowedIncomingMulticastActionTypes
	          }) === null)) {
	            _context7.next = 9;
	            break;
	          }

	          throw new Error("Failed to register namespaced saga: given path `" + registeredPath + "` has been registered.");

	        case 9:
	          _context7.next = 11;
	          return call(multicastChannel);

	        case 11:
	          chan = _context7.sent;
	          newSagaItem = _extends_1({}, sagaItem, {
	            chan: chan,
	            path: registeredPath,
	            allowedIncomingMulticastActionTypes: allowedIncomingMulticastActionTypes
	          });
	          effects$$1 = {};
	          Object.keys(namespacedEffects).forEach(function (idx) {
	            effects$$1[idx] = namespacedEffects[idx].bind(_this, newSagaItem);
	          });
	          _context7.next = 17;
	          return fork(
	          /*#__PURE__*/
	          regenerator.mark(function _callee2() {
	            return regenerator.wrap(function _callee2$(_context6) {
	              while (1) {
	                switch (_context6.prev = _context6.next) {
	                  case 0:
	                    _context6.prev = 0;
	                    _context6.next = 3;
	                    return call(saga, effects$$1);

	                  case 3:
	                    _context6.next = 8;
	                    break;

	                  case 5:
	                    _context6.prev = 5;
	                    _context6.t0 = _context6["catch"](0);
	                    log$1("Error thrown from saga registered at `" + registeredPath + "`: ", "error", _context6.t0);

	                  case 8:
	                  case "end":
	                    return _context6.stop();
	                }
	              }
	            }, _callee2, this, [[0, 5]]);
	          }));

	        case 17:
	          task = _context7.sent;
	          registerSagaItem = _extends_1({}, newSagaItem, {
	            task: task
	          });
	          this.namespacedSagaItemStore[registeredPath] = registerSagaItem;

	        case 20:
	        case "end":
	          return _context7.stop();
	      }
	    }
	  }, _marked4, this);
	}

	function initGlobalSaga(saga) {
	  var task;
	  return regenerator.wrap(function initGlobalSaga$(_context9) {
	    while (1) {
	      switch (_context9.prev = _context9.next) {
	        case 0:
	          _context9.next = 2;
	          return fork(
	          /*#__PURE__*/
	          regenerator.mark(function _callee3() {
	            return regenerator.wrap(function _callee3$(_context8) {
	              while (1) {
	                switch (_context8.prev = _context8.next) {
	                  case 0:
	                    _context8.prev = 0;
	                    _context8.next = 3;
	                    return call(saga);

	                  case 3:
	                    _context8.next = 8;
	                    break;

	                  case 5:
	                    _context8.prev = 5;
	                    _context8.t0 = _context8["catch"](0);
	                    log$1("Error thrown from registered global saga: ", "error", _context8.t0);

	                  case 8:
	                  case "end":
	                    return _context8.stop();
	                }
	              }
	            }, _callee3, this, [[0, 5]]);
	          }));

	        case 2:
	          task = _context9.sent;
	          this.globalSagaTaskList.push(task);

	        case 4:
	        case "end":
	          return _context9.stop();
	      }
	    }
	  }, _marked5, this);
	}

	function cancelSaga$1(pathOrTask) {
	  var _this2 = this;

	  var path, sagaItem;
	  return regenerator.wrap(function cancelSaga$(_context10) {
	    while (1) {
	      switch (_context10.prev = _context10.next) {
	        case 0:
	          if (!(typeof pathOrTask === "string")) {
	            _context10.next = 12;
	            break;
	          }

	          path = normalize(pathOrTask);
	          this.pathRegistry.remove(path);
	          sagaItem = this.namespacedSagaItemStore[path];

	          if (sagaItem) {
	            _context10.next = 6;
	            break;
	          }

	          return _context10.abrupt("return");

	        case 6:
	          delete this.namespacedSagaItemStore[path];
	          sagaItem.chan.close();
	          _context10.next = 10;
	          return cancel$1(sagaItem.task);

	        case 10:
	          _context10.next = 16;
	          break;

	        case 12:
	          Object.keys(this.namespacedSagaItemStore).forEach(function (idx) {
	            if (_this2.namespacedSagaItemStore[idx].task === pathOrTask) {
	              delete _this2.namespacedSagaItemStore[idx];
	            }
	          });
	          this.globalSagaTaskList = this.globalSagaTaskList.filter(function (s) {
	            return s !== pathOrTask;
	          });
	          _context10.next = 16;
	          return cancel$1(pathOrTask);

	        case 16:
	        case "end":
	          return _context10.stop();
	      }
	    }
	  }, _marked6, this);
	}

	var SagaRegistry =
	/*#__PURE__*/
	function () {
	  function SagaRegistry(appContainer) {
	    this.appContainer = appContainer;
	    this.namespacedSagaItemStore = {};
	    this.globalSagaTaskList = [];
	    this.pathRegistry = new PathRegistry();
	    this.hostSagaCommandChan = new EventChannel(expanding());
	    this.appContainer.actionRegistry.register(namespace$1, actionTypes$1);
	  }

	  var _proto = SagaRegistry.prototype;

	  _proto.createHostSaga = function createHostSaga() {
	    return hostSaga.bind(this);
	  };

	  _proto.register = function register(saga, sagaOptions) {
	    if (!saga || typeof saga !== "function") throw new Error("SagaRegistry::register: saga parameter cannot be empty!");

	    var sagaItem = _extends_1({
	      saga: saga
	    }, is$1.object(sagaOptions) ? sagaOptions : {});

	    this.hostSagaCommandChan.dispatch(initSaga(sagaItem));
	  };

	  _proto.deregister = function deregister(pathOrTask) {
	    if (!pathOrTask) throw new Error("SagaRegistry::deregister: pathOrTask parameter cannot be empty!");
	    this.hostSagaCommandChan.dispatch(cancelSaga(pathOrTask));
	  };

	  return SagaRegistry;
	}();

	var standardliseActionTypesParameter = function standardliseActionTypesParameter(actionTypes) {
	  var newActionList = {};

	  if (is$1.symbol(actionTypes)) {
	    newActionList[String(actionTypes)] = actionTypes;
	  } else if (is$1.array(actionTypes) && actionTypes.length) {
	    actionTypes.forEach(function (actionType) {
	      if (!is$1.symbol(actionType)) {
	        throw new Error("ActionRegistry: Action type must be a symbol.");
	      }

	      newActionList[String(actionType)] = actionType;
	    });
	  } else if (is$1.object(actionTypes)) {
	    Object.keys(actionTypes).forEach(function (key) {
	      if (!is$1.symbol(actionTypes[key])) {
	        throw new Error("ActionRegistry: Action type must be a symbol.");
	      }

	      newActionList[String(actionTypes[key])] = actionTypes[key];
	    });
	  } else {
	    throw new Error("ActionRegistry: actionTypes must be a symbol or a list / array of symbols.");
	  }

	  return newActionList;
	};

	var ActionRegistry =
	/*#__PURE__*/
	function () {
	  function ActionRegistry() {
	    this.pathRegistry = new PathRegistry();
	  }

	  var _proto = ActionRegistry.prototype;

	  _proto.register = function register(namespace, actionTypes) {
	    namespace = normalize(namespace);
	    var newActionList = standardliseActionTypesParameter(actionTypes);

	    if (this.pathRegistry.exist(namespace)) {
	      var data = this.pathRegistry.getPathData(namespace);
	      var actionList = Object.assign({}, is$1.object(data.actionList) ? data.actionList : {}, newActionList);
	      this.pathRegistry.setPathData(namespace, _extends_1({}, data, {
	        actionList: actionList
	      }));
	    } else {
	      this.pathRegistry.add(namespace, {
	        actionList: newActionList
	      });
	    }
	  };

	  _proto.deregister = function deregister(namespace, actionTypes) {
	    if (actionTypes === void 0) {
	      actionTypes = null;
	    }

	    namespace = normalize(namespace);
	    if (!this.pathRegistry.exist(namespace)) return;

	    if (!actionTypes) {
	      this.pathRegistry.remove(namespace);
	    } else {
	      var newActionList = Object.values(standardliseActionTypesParameter(actionTypes));

	      var _this$pathRegistry$ge = this.pathRegistry.getPathData(namespace),
	          actionList = _this$pathRegistry$ge.actionList;

	      var actionListKeys = Object.keys(actionList).filter(function (key) {
	        return newActionList.indexOf(actionList[key]) === -1;
	      });

	      if (!actionListKeys.length) {
	        this.pathRegistry.remove(namespace);
	      } else {
	        actionListKeys.forEach(function (key) {
	          delete actionList[key];
	        });
	        this.pathRegistry.setPathData({
	          actionList: actionList
	        });
	      }
	    }
	  };

	  _proto.findNamespaceByActionType = function findNamespaceByActionType(actionType) {
	    return this.pathRegistry.searchPathByPathData(function (_ref) {
	      var actionList = _ref.actionList;
	      return Object.values(actionList).indexOf(actionType) !== -1;
	    });
	  };

	  _proto.serialiseAction = function serialiseAction(action) {
	    if (!is$1.action(action)) {
	      throw new Error("serialiseAction: Cannot action parameter is not a valid Action.");
	    }

	    var namespace = action.namespace,
	        type = action.type;

	    if (!namespace) {
	      throw new Error("serialiseAction: Cannot locate namespace property from action parameter");
	    }

	    var _this$pathRegistry$ge2 = this.pathRegistry.getPathData(namespace),
	        actionList = _this$pathRegistry$ge2.actionList;

	    if (!is$1.object(actionList) || !Object.keys(actionList).length || !Object.values(actionList).indexOf(action) === -1) {
	      throw new Error("serialiseAction: the action type is not register yet.");
	    }

	    var newAction = _extends_1({}, action, {
	      type: String(type)
	    });

	    if (action[NAMESPACED] === true) {
	      newAction[String(NAMESPACED)] = true;
	    }

	    return JSON.stringify(newAction);
	  };

	  _proto.deserialiseAction = function deserialiseAction(actionJson) {
	    var action = JSON.parse(actionJson);

	    if (!action || !action.namespace) {
	      throw new Error("Cannot deserialise action without namespace property!");
	    }

	    if (action[String(NAMESPACED)] === true) {
	      action[NAMESPACED] = true;
	    }

	    var _this$pathRegistry$ge3 = this.pathRegistry.getPathData(action.namespace),
	        actionList = _this$pathRegistry$ge3.actionList;

	    if (!is$1.object(actionList)) {
	      throw new Error("Cannot deserialise unregistered action!");
	    }

	    var type = actionList[action.type];

	    if (!type) {
	      throw new Error("Cannot deserialise unregistered action!");
	    }

	    action.type = type;
	    return action;
	  };

	  return ActionRegistry;
	}();

	var NamespaceRegistry =
	/*#__PURE__*/
	function () {
	  function NamespaceRegistry(appContainer) {
	    this.appContainer = appContainer;
	    this.pathRegistry = new PathRegistry();
	  }

	  var _proto = NamespaceRegistry.prototype;

	  _proto.registerComponentManager = function registerComponentManager(cm) {
	    var namespace = cm.namespace,
	        options = cm.options;
	    var namespaceInitCallback = options.namespaceInitCallback,
	        namespaceDestroyCallback = options.namespaceDestroyCallback,
	        actionTypes = options.actionTypes;

	    if (this.pathRegistry.exist(namespace)) {
	      var _this$pathRegistry$ge = this.pathRegistry.getPathData(namespace),
	          cmList = _this$pathRegistry$ge.cmList;

	      cmList.push(cm);
	    } else {
	      if (actionTypes) {
	        this.appContainer.actionRegistry.register(namespace, actionTypes);
	      }

	      this.pathRegistry.add(namespace, {
	        cmList: [cm],
	        namespaceData: is$1.func(namespaceInitCallback) ? namespaceInitCallback() : {},
	        namespaceInitCallback: namespaceInitCallback,
	        namespaceDestroyCallback: namespaceDestroyCallback,
	        actionTypes: actionTypes
	      });
	    }
	  };

	  _proto.deregisterComponentManager = function deregisterComponentManager(cm) {
	    var namespace = cm.namespace;

	    var _this$pathRegistry$ge2 = this.pathRegistry.getPathData(namespace),
	        cmList = _this$pathRegistry$ge2.cmList,
	        namespaceDestroyCallback = _this$pathRegistry$ge2.namespaceDestroyCallback,
	        namespaceData = _this$pathRegistry$ge2.namespaceData;

	    cmList = cmList.filter(function (item) {
	      return item !== cm;
	    });

	    if (!cmList.length) {
	      this.pathRegistry.remove(namespace);
	      this.appContainer.actionRegistry.deregister(namespace);

	      if (is$1.func(namespaceDestroyCallback)) {
	        namespaceDestroyCallback(namespaceData);
	      }
	    }
	  };

	  _proto.foreach = function foreach(iteratee) {
	    this.pathRegistry.foreach(function (_ref, namespace) {
	      var namespaceData = _ref.namespaceData;
	      return iteratee(namespaceData, namespace);
	    });
	  };

	  _proto.map = function map(iteratee) {
	    this.pathRegistry.map(function (_ref2, namespace) {
	      var namespaceData = _ref2.namespaceData;
	      return iteratee(namespaceData, namespace);
	    });
	  };

	  return NamespaceRegistry;
	}();

	var actionBlackList =
	/*#__PURE__*/
	Object.keys(actionTypes).map(function (idx) {
	  return actionTypes[idx];
	}).concat(
	/*#__PURE__*/
	Object.keys(actionTypes$1).map(function (idx) {
	  return actionTypes$1[idx];
	}));
	var defaultDevToolOptions = {
	  actionSanitizer: function actionSanitizer(action) {
	    return _extends_1({}, action, {
	      type: String(action.type)
	    });
	  },
	  predicate: function predicate(state, action) {
	    return action && actionBlackList.indexOf(action.type) === -1;
	  }
	};
	var defaultOptions$2 = {
	  reducer: null,
	  initState: {},
	  middlewares: [],
	  reduxDevToolsDevOnly: true,
	  //-- https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#windowdevtoolsextensionconfig
	  devToolOptions:
	  /*#__PURE__*/
	  _extends_1({}, defaultDevToolOptions),
	  //-- https://redux-saga.js.org/docs/api/index.html#createsagamiddlewareoptions
	  sagaMiddlewareOptions: {},
	  isServerSideRendering: false
	};

	var getComposeEnhancers = function getComposeEnhancers(devOnly, options) {
	  /* eslint-disable-next-line no-underscore-dangle */
	  if (typeof window !== "object" || !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) return compose;
	  if (devOnly && "development" === "production") return compose;

	  var devToolOptions = _extends_1({}, options ? options : {});
	  /* eslint-disable-next-line no-underscore-dangle */


	  return window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devToolOptions);
	};

	var AppContainer =
	/*#__PURE__*/
	function () {
	  function AppContainer(options) {
	    if (options === void 0) {
	      options = {};
	    }

	    this.store = null;
	    this.actionRegistry = new ActionRegistry();
	    this.namespaceRegistry = new NamespaceRegistry(this);

	    var containerCreationOptions = _extends_1({}, defaultOptions$2, options);

	    var composeEnhancers = getComposeEnhancers(containerCreationOptions.reduxDevToolsDevOnly, containerCreationOptions.devToolOptions);
	    var sagaMiddleware = sagaMiddlewareFactory(containerCreationOptions.sagaMiddlewareOptions);
	    var middlewares = containerCreationOptions.middlewares.concat([
	    /**
	     * Make sure `sagaMiddleware` is the last in the list
	     * Therefore, reducers are run before saga.
	     */
	    sagaMiddleware]);
	    this.eventEmitters = [];
	    this.componentRegistry = new ComponentRegistry(this, {
	      isServerSideRendering: containerCreationOptions.isServerSideRendering
	    });
	    this.reducerRegistry = new ReducerRegistry(this);
	    this.sagaRegistry = new SagaRegistry(this);
	    this.store = createStore(this.reducerRegistry.createGlobalReducer(containerCreationOptions.reducer), _extends_1({}, containerCreationOptions.initState), composeEnhancers(applyMiddleware.apply(void 0, middlewares)));
	    this.hostSagaTask = sagaMiddleware.run(this.sagaRegistry.createHostSaga());
	  }

	  var _proto = AppContainer.prototype;

	  _proto.registerComponent = function registerComponent(componentInstance, options) {
	    return this.componentRegistry.register(componentInstance, options);
	  };

	  _proto.deregisterComponent = function deregisterComponent(componentInstance) {
	    this.componentRegistry.deregister(componentInstance);
	  };

	  _proto.destroy = function destroy() {
	    this.componentRegistry.destroy();
	  };

	  return AppContainer;
	}();

	var APP_CONTAINER_KEY = "__appContainer";
	var defaultAppContainer = null;
	function createAppContainer(options) {
	  if (options === void 0) {
	    options = {};
	  }

	  if (defaultAppContainer) {
	    log$1("AppContainerUtils.createAppContainer: Existing appContainer found. " + "The appContainer options supplied was ignored. " + "Existing appContainer will be used.", "warn");
	    return defaultAppContainer;
	  }

	  var ac = new AppContainer(options);
	  defaultAppContainer = ac;
	  return ac;
	}
	function getAppContainer(componentInstance) {
	  if (componentInstance === void 0) {
	    componentInstance = null;
	  }

	  if (componentInstance) {
	    if (componentInstance.props && componentInstance.props[APP_CONTAINER_KEY]) return componentInstance.props[APP_CONTAINER_KEY];
	    if (componentInstance.context && componentInstance.context[APP_CONTAINER_KEY]) return componentInstance.context[APP_CONTAINER_KEY];
	  }

	  if (!defaultAppContainer) {
	    defaultAppContainer = createAppContainer();
	  }

	  return defaultAppContainer;
	}
	function registerComponent(componentInstance, options) {
	  var appContainer = getAppContainer(componentInstance);
	  return appContainer.registerComponent(componentInstance, options);
	}
	function deregisterComponent(componentInstance) {
	  var appContainer = getAppContainer(componentInstance);
	  return appContainer.deregisterComponent(componentInstance);
	}
	function registerSaga(saga, sagaOptions, componentInstance) {
	  if (componentInstance === void 0) {
	    componentInstance = null;
	  }

	  var appContainer = getAppContainer(componentInstance);
	  return appContainer.sagaRegistry.register(saga, sagaOptions);
	}
	function deregisterSaga(pathOrTask, componentInstance) {
	  if (componentInstance === void 0) {
	    componentInstance = null;
	  }

	  var appContainer = getAppContainer(componentInstance);
	  return appContainer.sagaRegistry.deregister(pathOrTask);
	}
	function registerReducer(reducer, reducerOptions, componentInstance) {
	  if (componentInstance === void 0) {
	    componentInstance = null;
	  }

	  var appContainer = getAppContainer(componentInstance);
	  return appContainer.reducerRegistry.register(reducer, reducerOptions);
	}
	function deregisterReducer(path, componentInstance) {
	  if (componentInstance === void 0) {
	    componentInstance = null;
	  }

	  var appContainer = getAppContainer(componentInstance);
	  return appContainer.reducerRegistry.deregister(path);
	}
	function registerActions(namespace, actions, componentInstance) {
	  if (componentInstance === void 0) {
	    componentInstance = null;
	  }

	  var appContainer = getAppContainer(componentInstance);
	  return appContainer.actionRegistry.register(namespace, actions);
	}
	function serialiseAction(action, componentInstance) {
	  if (componentInstance === void 0) {
	    componentInstance = null;
	  }

	  var appContainer = getAppContainer(componentInstance);
	  return appContainer.actionRegistry.serialiseAction(action);
	}
	function deserialiseAction(actionJson, componentInstance) {
	  if (componentInstance === void 0) {
	    componentInstance = null;
	  }

	  var appContainer = getAppContainer(componentInstance);
	  return appContainer.actionRegistry.deserialiseAction(actionJson);
	}
	function findNamespaceByActionType(actionType, componentInstance) {
	  if (componentInstance === void 0) {
	    componentInstance = null;
	  }

	  var appContainer = getAppContainer(componentInstance);
	  return appContainer.actionRegistry.findNamespaceByActionType(actionType);
	}
	function destroyAppContainer(componentInstance) {
	  if (componentInstance === void 0) {
	    componentInstance = null;
	  }

	  var appContainer = getAppContainer(componentInstance);
	  appContainer.destroy();

	  if (appContainer === defaultAppContainer) {
	    defaultAppContainer = null;
	  }
	}
	/**
	 * Update AppContainerRetrieveKey
	 * This key is used by AppContainerUtils for looking up `appContainer` instance
	 * from either Component Instance props or context
	 * @param {string} newKey
	 * return Current key
	 */

	function updateAppContainerRetrieveKey(newKey) {
	  var currentKey = APP_CONTAINER_KEY;
	  APP_CONTAINER_KEY = newKey;
	  return currentKey;
	}

	var AppContainerUtils = /*#__PURE__*/Object.freeze({
		createAppContainer: createAppContainer,
		getAppContainer: getAppContainer,
		registerComponent: registerComponent,
		deregisterComponent: deregisterComponent,
		registerSaga: registerSaga,
		deregisterSaga: deregisterSaga,
		registerReducer: registerReducer,
		deregisterReducer: deregisterReducer,
		registerActions: registerActions,
		serialiseAction: serialiseAction,
		deserialiseAction: deserialiseAction,
		findNamespaceByActionType: findNamespaceByActionType,
		destroyAppContainer: destroyAppContainer,
		updateAppContainerRetrieveKey: updateAppContainerRetrieveKey
	});

	function _inheritsLoose(subClass, superClass) {
	  subClass.prototype = Object.create(superClass.prototype);
	  subClass.prototype.constructor = subClass;
	  subClass.__proto__ = superClass;
	}

	var inheritsLoose = _inheritsLoose;

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	var assertThisInitialized = _assertThisInitialized;

	var _marked$1 =
	/*#__PURE__*/
	regenerator.mark(forwarderSaga);
	/**
	 * A helper container component used to forward actions to another namespace
	 */

	var ActionForwarder =
	/*#__PURE__*/
	function (_React$Component) {
	  inheritsLoose(ActionForwarder, _React$Component);

	  function ActionForwarder(props) {
	    var _this;

	    _this = _React$Component.call(this, props) || this;
	    _this.appContainer = getAppContainer();
	    _this.componentManager = registerComponent(assertThisInitialized(assertThisInitialized(_this)), {
	      namespace: "io.github.t83714/ActionForwarder",
	      saga: forwarderSaga.bind(assertThisInitialized(assertThisInitialized(_this))),
	      // --- By default, component will not accept any incoming multicast action.
	      // --- "*" will allow any action types to be accepted
	      // --- No limit to actions that are sent out
	      allowedIncomingMulticastActionTypes: "*"
	    });
	    return _this;
	  }

	  var _proto = ActionForwarder.prototype;

	  _proto.render = function render() {
	    return null;
	  };

	  return ActionForwarder;
	}(React.Component);

	ActionForwarder.propTypes = {
	  namespacePrefix: PropTypes.string.isRequired,
	  pattern:
	  /*#__PURE__*/
	  PropTypes.oneOfType([PropTypes.symbol, PropTypes.func,
	  /*#__PURE__*/
	  PropTypes.arrayOf(
	  /*#__PURE__*/
	  PropTypes.oneOfType([PropTypes.string, PropTypes.func]))]),

	  /**
	   * `relativeDispatchPath` will only be used, if `toGlobal` is not true or not supplied
	   */
	  toGlobal: PropTypes.bool,
	  absoluteDispatchPath: PropTypes.string,
	  relativeDispatchPath: PropTypes.string,
	  transformer:
	  /*#__PURE__*/
	  PropTypes.oneOfType([PropTypes.symbol, PropTypes.func])
	};

	function forwarderSaga(effects) {
	  return regenerator.wrap(function forwarderSaga$(_context2) {
	    while (1) {
	      switch (_context2.prev = _context2.next) {
	        case 0:
	          _context2.next = 2;
	          return effects.takeEvery(this.props.pattern ? this.props.pattern : "*",
	          /*#__PURE__*/
	          regenerator.mark(function _callee(action) {
	            var newAction, relativeDispatchPath;
	            return regenerator.wrap(function _callee$(_context) {
	              while (1) {
	                switch (_context.prev = _context.next) {
	                  case 0:
	                    if (!(action.currentSenderPath === this.componentManager.fullPath)) {
	                      _context.next = 2;
	                      break;
	                    }

	                    return _context.abrupt("return");

	                  case 2:
	                    newAction = actionTransformer.call(this, action, this.props.transformer); //--- unnamespace forward

	                    if (!(this.props.toGlobal === true)) {
	                      _context.next = 13;
	                      break;
	                    }

	                    if (!this.props.absoluteDispatchPath) {
	                      _context.next = 9;
	                      break;
	                    }

	                    _context.next = 7;
	                    return put(_extends_1({}, newAction, {
	                      type: this.props.absoluteDispatchPath + "/" + newAction.type
	                    }));

	                  case 7:
	                    _context.next = 11;
	                    break;

	                  case 9:
	                    _context.next = 11;
	                    return put(newAction);

	                  case 11:
	                    _context.next = 16;
	                    break;

	                  case 13:
	                    //--- namespaced forward

	                    /**
	                     * namespaced forward
	                     * `ActionForwarder`'s current namespace path is:
	                     * `${props.namespacePrefix}/io.github.t83714/ActionForwarder/${this.componentManager.componentId}`
	                     * Add `../../../` to `props.relativeDispatchPath` so that relative namespace path
	                     * will start from `${props.namespace}`.
	                     * This might be easier for people to use `ActionForwarder` as we don't need to
	                     * always add `three levels up` in order to throw action out of `ActionForwarder`
	                     */
	                    relativeDispatchPath = this.props.relativeDispatchPath ? "../../../" + this.props.relativeDispatchPath : "";
	                    _context.next = 16;
	                    return effects.put(newAction, relativeDispatchPath);

	                  case 16:
	                  case "end":
	                    return _context.stop();
	                }
	              }
	            }, _callee, this);
	          }).bind(this));

	        case 2:
	        case "end":
	          return _context2.stop();
	      }
	    }
	  }, _marked$1, this);
	}

	function actionTransformer(action, transformer) {
	  if (!transformer) return action;
	  var newAction = action;

	  if (is$1.symbol(transformer)) {
	    newAction = _extends_1({}, action, {
	      type: transformer
	    });
	  } else if (is$1.func(transformer)) {
	    newAction = transformer(action);
	  }

	  return newAction;
	}

	exports.AppContainer = AppContainer;
	exports.AppContainerUtils = AppContainerUtils;
	exports.ActionForwarder = ActionForwarder;
	exports.utils = utils;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
