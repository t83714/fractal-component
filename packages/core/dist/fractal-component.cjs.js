'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _extends = _interopDefault(require('@babel/runtime/helpers/extends'));
var utils = require('redux-saga/utils');
var objectPath = _interopDefault(require('object-path'));
var objectPathImmutable = _interopDefault(require('object-path-immutable'));
var intersection = _interopDefault(require('lodash/intersection'));
var createSagaMiddleware = require('redux-saga');
var createSagaMiddleware__default = _interopDefault(createSagaMiddleware);
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
var rsEffects = require('redux-saga/effects');
var redux = require('redux');
var _inheritsLoose = _interopDefault(require('@babel/runtime/helpers/inheritsLoose'));
var _assertThisInitialized = _interopDefault(require('@babel/runtime/helpers/assertThisInitialized'));
var React = _interopDefault(require('react'));
var PropTypes = _interopDefault(require('prop-types'));

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

if (process && process.env && process.env.NODE_ENV && process.env.NODE_ENV === "development") {
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

  if (is.number(pid) && pid) {
    pid = pid.toString(36);
  } else {
    pid = "";
  }

  if (is.number(mac) && mac) {
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
var log = function log(message, level, error) {
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
  if (is.string(v)) return v.trim();
  var s = String(v);
  return s.trim();
};
var konst = function konst(v) {
  return function () {
    return v;
  };
};
var kTrue =
/*#__PURE__*/
konst(true);
var kFalse =
/*#__PURE__*/
konst(false);
var noop = function noop() {};
var identity = function identity(v) {
  return v;
};
var is =
/*#__PURE__*/
_extends({}, utils.is, {
  bool: function bool(v) {
    return typeof v === "boolean";
  },
  action: function action(v) {
    return utils.is.object(v) && utils.is.symbol(v.type);
  },
  namespacedAction: function namespacedAction(v) {
    return is.action(v) && v[NAMESPACED];
  }
});

var utils$1 = /*#__PURE__*/Object.freeze({
  isInNode: isInNode,
  getMachineInfo: getMachineInfo,
  uniqid: uniqid,
  getPackageName: getPackageName,
  getPackageVersion: getPackageVersion,
  isDevMode: isDevMode,
  log: log,
  trim: trim,
  konst: konst,
  kTrue: kTrue,
  kFalse: kFalse,
  noop: noop,
  identity: identity,
  is: is
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

    if (is.string(paths)) paths = [paths];
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

    if (!is.object(action)) {
      throw new Error("Tried to dispatch action in invalid type: " + typeof action);
    }

    if (!is.symbol(action.type)) {
      throw new Error("action.type cannot be " + typeof action.type + " and must be a Symbol");
    }

    var path = normalize(relativeDispatchPath);
    var isMulticast = false;

    if (path.length && path[path.length - 1] === "*") {
      isMulticast = true;
      path = normalize(path.substring(0, path.length - 1));
    }

    var absolutePath = this.resolve(path);

    var newAction = _extends({}, action, (_extends2 = {}, _extends2[NAMESPACED] = true, _extends2.isMulticast = isMulticast, _extends2.currentSenderPath = this.cwd, _extends2.currentDispatchPath = absolutePath, _extends2.currentComponentId = this.getLastSegment(), _extends2));

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
    if (is.notUndef(data)) this.dataStore[path] = data;
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
    if (is.object(this.dataStore[path])) {
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

    if (!is.func(predictFunc)) throw new Error("searchPathByPathData require function as parameter!");
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
    if (is.string(allowedIncomingMulticastActionTypes) && allowedIncomingMulticastActionTypes === "*") return true;

    if (is.symbol(allowedIncomingMulticastActionTypes)) {
      return allowedIncomingMulticastActionTypes === actionType;
    }

    if (!is.array(allowedIncomingMulticastActionTypes)) {
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

        if (!is.number(localPathPos)) return true;
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
    this.options = _extends({}, defaultOptions, options);
    this.appContainer = appContainer;
    this.store = appContainer.store;
    this.isInitialized = false;
    this.isDestroyed = false;
    this.initCallback = noop;
    this.destroyCallback = noop;
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
      log("Cannot locate namespace for Action `" + newAction.type + "`: `" + newAction.type + "` needs to be registered otherwise the action won't be serializable.");
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

  this.initState = _extends({}, initState);
}

function injectLifeHookers() {
  var origComponentDidMount = this.managingInstance.componentDidMount ? this.managingInstance.componentDidMount : noop;
  var origComponentWillUnmount = this.managingInstance.componentWillUnmount ? this.managingInstance.componentWillUnmount : noop;
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
    this.options = _extends({}, defaultOptions$1, options);
    this.pathRegistry = new PathRegistry();
    this.componentManagerStore = {};
  }

  var _proto = ComponentRegistry.prototype;

  _proto.register = function register(componentInstance, options) {
    var runTimeOptions = _extends({}, this.options, options);

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
  if (cm.options.reducer && is.func(cm.options.reducer)) {
    this.appContainer.reducerRegistry.register(cm.options.reducer.bind(cm.componentInstance), {
      initState: cm.initState,
      path: cm.fullPath,
      namespace: cm.namespace,
      persistState: cm.persistState,
      allowedIncomingMulticastActionTypes: cm.allowedIncomingMulticastActionTypes
    });
  }

  if (cm.options.saga && is.func(cm.options.saga)) {
    this.appContainer.sagaRegistry.register(cm.options.saga.bind(cm.componentInstance), {
      path: cm.fullPath,
      namespace: cm.namespace,
      allowedIncomingMulticastActionTypes: cm.allowedIncomingMulticastActionTypes
    });
  }
}

function deRegisterComponentManager(cm) {
  if (cm.options.reducer && is.func(cm.options.reducer)) {
    this.appContainer.sagaRegistry.deregister(cm.fullPath);
  }

  if (cm.options.saga && is.func(cm.options.saga)) {
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

      if (intersection(Object.keys(existingData), Object.keys(data)).length) {
        //--- has initilised
        return state;
      }
    }
  }

  return objectPathImmutable.assign(state, pathItems, data);
}
/**
 * This function should NOT return a new state copy
 */


function processEmptyState(state, action) {
  var _action$payload2 = action.payload,
      path = _action$payload2.path,
      data = _action$payload2.data;
  var pathItems = path.split("/");
  return objectPathImmutable.update(state, pathItems, function (targetState) {
    Object.keys(data).forEach(function (key) {
      delete targetState[key];
    });
    return targetState;
  });
}

function processNamespacedAction(state, action) {
  var _this = this;

  if (!is.namespacedAction(action)) return state;
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
      newState = objectPathImmutable.assign(newState, pathItems, newComponentState);
    }
  });
  return newState;
}

function globalReducer(externalGlobalReducer, state, action) {
  if (!is.action(action)) return state;
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
    if (!reducerOptions) reducerOptions = _extends({}, defaultReducerOptions);
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

    this.reducerStore[registeredPath] = _extends({}, reducerOptions, {
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
      this.buffer = createSagaMiddleware.buffers.expanding();
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

    return createSagaMiddleware.eventChannel(function (emitter) {
      _this.subscribe(emitter);

      return function () {
        _this.unsubscribe(emitter);
      };
    }, this.buffer, matcher ? matcher : kTrue);
  };

  return EventChannel;
}();

function take(sagaItem, pattern) {
  var chan = sagaItem.chan;
  return rsEffects.take(chan, pattern);
}
function put(sagaItem, action, relativeDispatchPath) {
  if (relativeDispatchPath === void 0) {
    relativeDispatchPath = "";
  }

  var path = sagaItem.path;
  var pc = new PathContext(path);
  var namespacedAction = pc.convertNamespacedAction(action, relativeDispatchPath); // --- query action Type's original namespace so that it can be serialised correctly if needed

  var namespace = this.appContainer.actionRegistry.findNamespaceByActionType(namespacedAction.type);

  if (!namespace) {
    log("Cannot locate namespace for Action `" + newAction.type + "`: `" + newAction.type + "` needs to be registered otherwise the action won't be serializable.");
  } else {
    namespacedAction.namespace = namespace;
  }

  return rsEffects.put(namespacedAction);
}
function select(sagaItem, selector) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  var path = sagaItem.path;
  var pathItems = path.split("/");
  return rsEffects.select(function (state) {
    var namespacedState = objectPath.get(state, pathItems);

    if (selector && is.func(selector)) {
      return selector.apply(void 0, [namespacedState].concat(args));
    }

    return namespacedState;
  });
}
var takeEvery = function takeEvery(sagaItem, pattern, saga) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    args[_key2 - 3] = arguments[_key2];
  }

  return rsEffects.fork(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee() {
    var action;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:

            _context.next = 3;
            return take(sagaItem, pattern);

          case 3:
            action = _context.sent;
            _context.next = 6;
            return rsEffects.fork.apply(void 0, [saga].concat(args.concat(action)));

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
var takeLatest = function takeLatest(sagaItem, pattern, saga) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
    args[_key3 - 3] = arguments[_key3];
  }

  return rsEffects.fork(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2() {
    var lastTask, action;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:

            _context2.next = 3;
            return take(sagaItem, pattern);

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
            return rsEffects.fork.apply(void 0, [saga].concat(args.concat(action)));

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
var takeLeading = function takeLeading(sagaItem, pattern, saga) {
  for (var _len4 = arguments.length, args = new Array(_len4 > 3 ? _len4 - 3 : 0), _key4 = 3; _key4 < _len4; _key4++) {
    args[_key4 - 3] = arguments[_key4];
  }

  return rsEffects.fork(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee3() {
    var action;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:

            _context3.next = 3;
            return take(sagaItem, pattern);

          case 3:
            action = _context3.sent;
            _context3.next = 6;
            return rsEffects.call.apply(void 0, [saga].concat(args.concat(action)));

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
var throttle = function throttle(sagaItem, ms, pattern, task) {
  for (var _len5 = arguments.length, args = new Array(_len5 > 4 ? _len5 - 4 : 0), _key5 = 4; _key5 < _len5; _key5++) {
    args[_key5 - 4] = arguments[_key5];
  }

  return rsEffects.fork(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee5() {
    var throttleChannel, action;
    return _regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return rsEffects.call(createSagaMiddleware.channel, createSagaMiddleware.buffers.sliding(1));

          case 2:
            throttleChannel = _context5.sent;
            _context5.next = 5;
            return takeEvery(sagaItem, "*",
            /*#__PURE__*/
            _regeneratorRuntime.mark(function _callee4(action) {
              return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return rsEffects.put(throttleChannel, action);

                    case 2:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4, this);
            }));

          case 5:

            _context5.next = 8;
            return rsEffects.take(throttleChannel);

          case 8:
            action = _context5.sent;
            _context5.next = 11;
            return rsEffects.fork.apply(void 0, [task].concat(args, [action]));

          case 11:
            _context5.next = 13;
            return rsEffects.delay(ms);

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
var actionChannel = function actionChannel(sagaItem, pattern, buffer) {
  return rsEffects.call(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee7() {
    var chan, bufferChan;
    return _regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            chan = sagaItem.chan;
            _context7.next = 3;
            return rsEffects.call(createSagaMiddleware.channel, buffer);

          case 3:
            bufferChan = _context7.sent;
            _context7.prev = 4;
            _context7.next = 7;
            return rsEffects.fork(
            /*#__PURE__*/
            _regeneratorRuntime.mark(function _callee6() {
              var action;
              return _regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                  switch (_context6.prev = _context6.next) {
                    case 0:

                      _context6.next = 3;
                      return take(chan, pattern);

                    case 3:
                      action = _context6.sent;
                      _context6.next = 6;
                      return put(bufferChan, action);

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
  take: take,
  put: put,
  select: select,
  takeEvery: takeEvery,
  takeLatest: takeLatest,
  takeLeading: takeLeading,
  throttle: throttle,
  actionChannel: actionChannel
});

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(hostSaga),
    _marked2 =
/*#__PURE__*/
_regeneratorRuntime.mark(startCommandChan),
    _marked3 =
/*#__PURE__*/
_regeneratorRuntime.mark(processCommandAction),
    _marked4 =
/*#__PURE__*/
_regeneratorRuntime.mark(initSaga$1),
    _marked5 =
/*#__PURE__*/
_regeneratorRuntime.mark(initGlobalSaga),
    _marked6 =
/*#__PURE__*/
_regeneratorRuntime.mark(cancelSaga$1);

function hostSaga() {
  return _regeneratorRuntime.wrap(function hostSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return rsEffects.fork([this, startCommandChan]);

        case 2:
          _context.next = 4;
          return rsEffects.fork([this, forwardNamespacedAction]);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, this);
}

var forwardNamespacedAction =
/*#__PURE__*/
_regeneratorRuntime.mark(function forwardNamespacedAction() {
  return _regeneratorRuntime.wrap(function forwardNamespacedAction$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return rsEffects.takeEvery(function (action) {
            return is.namespacedAction(action);
          },
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee(action) {
            var matchedPaths, i, sagaItem;
            return _regeneratorRuntime.wrap(function _callee$(_context2) {
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
                    return rsEffects.put(sagaItem.chan, action);

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
  return _regeneratorRuntime.wrap(function startCommandChan$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return rsEffects.call([this.hostSagaCommandChan, this.hostSagaCommandChan.create]);

        case 3:
          commandChan = _context4.sent;

        case 4:

          _context4.next = 7;
          return rsEffects.take(commandChan);

        case 7:
          action = _context4.sent;
          _context4.next = 10;
          return rsEffects.fork([this, processCommandAction], action);

        case 10:
          _context4.next = 4;
          break;

        case 12:
          _context4.prev = 12;
          _context4.next = 15;
          return rsEffects.cancelled();

        case 15:
          if (!_context4.sent) {
            _context4.next = 18;
            break;
          }

          log("Terminating Global Host Saga Command Channel.");
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
  return _regeneratorRuntime.wrap(function processCommandAction$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          type = _ref.type, payload = _ref.payload;
          _context5.t0 = type;
          _context5.next = _context5.t0 === INIT_SAGA ? 4 : _context5.t0 === CANCEL_SAGA ? 7 : 10;
          break;

        case 4:
          _context5.next = 6;
          return rsEffects.call([this, initSaga$1], payload);

        case 6:
          return _context5.abrupt("break", 11);

        case 7:
          _context5.next = 9;
          return rsEffects.call([this, cancelSaga$1], payload);

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

  var saga, path, namespace, allowedIncomingMulticastActionTypes, registeredPath, localPathPos, chan, newSagaItem, effects, task, registerSagaItem;
  return _regeneratorRuntime.wrap(function initSaga$(_context7) {
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
          return rsEffects.call([this, initGlobalSaga], saga);

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
          return rsEffects.call(createSagaMiddleware.multicastChannel);

        case 11:
          chan = _context7.sent;
          newSagaItem = _extends({}, sagaItem, {
            chan: chan,
            path: registeredPath,
            allowedIncomingMulticastActionTypes: allowedIncomingMulticastActionTypes
          });
          effects = {};
          Object.keys(namespacedEffects).forEach(function (idx) {
            effects[idx] = namespacedEffects[idx].bind(_this, newSagaItem);
          });
          _context7.next = 17;
          return rsEffects.fork(
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee2() {
            return _regeneratorRuntime.wrap(function _callee2$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.prev = 0;
                    _context6.next = 3;
                    return rsEffects.call(saga, effects);

                  case 3:
                    _context6.next = 8;
                    break;

                  case 5:
                    _context6.prev = 5;
                    _context6.t0 = _context6["catch"](0);
                    log("Error thrown from saga registered at `" + registeredPath + "`: ", "error", _context6.t0);

                  case 8:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee2, this, [[0, 5]]);
          }));

        case 17:
          task = _context7.sent;
          registerSagaItem = _extends({}, newSagaItem, {
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
  return _regeneratorRuntime.wrap(function initGlobalSaga$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return rsEffects.fork(
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee3() {
            return _regeneratorRuntime.wrap(function _callee3$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.prev = 0;
                    _context8.next = 3;
                    return rsEffects.call(saga);

                  case 3:
                    _context8.next = 8;
                    break;

                  case 5:
                    _context8.prev = 5;
                    _context8.t0 = _context8["catch"](0);
                    log("Error thrown from registered global saga: ", "error", _context8.t0);

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
  return _regeneratorRuntime.wrap(function cancelSaga$(_context10) {
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
          return rsEffects.cancel(sagaItem.task);

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
          return rsEffects.cancel(pathOrTask);

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
    this.hostSagaCommandChan = new EventChannel(createSagaMiddleware.buffers.expanding());
    this.appContainer.actionRegistry.register(namespace$1, actionTypes$1);
  }

  var _proto = SagaRegistry.prototype;

  _proto.createHostSaga = function createHostSaga() {
    return hostSaga.bind(this);
  };

  _proto.register = function register(saga, sagaOptions) {
    if (!saga || typeof saga !== "function") throw new Error("SagaRegistry::register: saga parameter cannot be empty!");

    var sagaItem = _extends({
      saga: saga
    }, is.object(sagaOptions) ? sagaOptions : {});

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

  if (is.symbol(actionTypes)) {
    newActionList[String(actionTypes)] = actionTypes;
  } else if (is.array(actionTypes) && actionTypes.length) {
    actionTypes.forEach(function (actionType) {
      if (!is.symbol(actionType)) {
        throw new Error("ActionRegistry: Action type must be a symbol.");
      }

      newActionList[String(actionType)] = actionType;
    });
  } else if (is.object(actionTypes)) {
    Object.keys(actionTypes).forEach(function (key) {
      if (!is.symbol(actionTypes[key])) {
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
      var actionList = Object.assign({}, is.object(data.actionList) ? data.actionList : {}, newActionList);
      this.pathRegistry.setPathData(namespace, _extends({}, data, {
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
    if (!is.action(action)) {
      throw new Error("serialiseAction: Cannot action parameter is not a valid Action.");
    }

    var namespace = action.namespace,
        type = action.type;

    if (!namespace) {
      throw new Error("serialiseAction: Cannot locate namespace property from action parameter");
    }

    var _this$pathRegistry$ge2 = this.pathRegistry.getPathData(namespace),
        actionList = _this$pathRegistry$ge2.actionList;

    if (!is.object(actionList) || !Object.keys(actionList).length || !Object.values(actionList).indexOf(action) === -1) {
      throw new Error("serialiseAction: the action type is not register yet.");
    }

    var newAction = _extends({}, action, {
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

    if (!is.object(actionList)) {
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
        namespaceData: is.func(namespaceInitCallback) ? namespaceInitCallback() : {},
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

      if (is.func(namespaceDestroyCallback)) {
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
    return _extends({}, action, {
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
  _extends({}, defaultDevToolOptions),
  //-- https://redux-saga.js.org/docs/api/index.html#createsagamiddlewareoptions
  sagaMiddlewareOptions: {},
  isServerSideRendering: false
};

var getComposeEnhancers = function getComposeEnhancers(devOnly, options) {
  /* eslint-disable-next-line no-underscore-dangle */
  if (typeof window !== "object" || !window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) return redux.compose;
  if (devOnly && process.env.NODE_ENV === "production") return redux.compose;

  var devToolOptions = _extends({}, options ? options : {});
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

    var containerCreationOptions = _extends({}, defaultOptions$2, options);

    var composeEnhancers = getComposeEnhancers(containerCreationOptions.reduxDevToolsDevOnly, containerCreationOptions.devToolOptions);
    var sagaMiddleware = createSagaMiddleware__default(containerCreationOptions.sagaMiddlewareOptions);
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
    this.store = redux.createStore(this.reducerRegistry.createGlobalReducer(containerCreationOptions.reducer), _extends({}, containerCreationOptions.initState), composeEnhancers(redux.applyMiddleware.apply(void 0, middlewares)));
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
    log("AppContainerUtils.createAppContainer: Existing appContainer found. " + "The appContainer options supplied was ignored. " + "Existing appContainer will be used.", "warn");
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

var _marked$1 =
/*#__PURE__*/
_regeneratorRuntime.mark(forwarderSaga);
/**
 * A helper container component used to forward actions to another namespace
 */

var ActionForwarder =
/*#__PURE__*/
function (_React$Component) {
  _inheritsLoose(ActionForwarder, _React$Component);

  function ActionForwarder(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.appContainer = getAppContainer();
    _this.componentManager = registerComponent(_assertThisInitialized(_assertThisInitialized(_this)), {
      namespace: "io.github.t83714/ActionForwarder",
      saga: forwarderSaga.bind(_assertThisInitialized(_assertThisInitialized(_this))),
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
  return _regeneratorRuntime.wrap(function forwarderSaga$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return effects.takeEvery(this.props.pattern ? this.props.pattern : "*",
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee(action) {
            var newAction, relativeDispatchPath;
            return _regeneratorRuntime.wrap(function _callee$(_context) {
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
                    return rsEffects.put(_extends({}, newAction, {
                      type: this.props.absoluteDispatchPath + "/" + newAction.type
                    }));

                  case 7:
                    _context.next = 11;
                    break;

                  case 9:
                    _context.next = 11;
                    return rsEffects.put(newAction);

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

  if (is.symbol(transformer)) {
    newAction = _extends({}, action, {
      type: transformer
    });
  } else if (is.func(transformer)) {
    newAction = transformer(action);
  }

  return newAction;
}

exports.AppContainer = AppContainer;
exports.AppContainerUtils = AppContainerUtils;
exports.ActionForwarder = ActionForwarder;
exports.utils = utils$1;
