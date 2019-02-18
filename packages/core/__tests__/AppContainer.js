import AppContainer from "../src/AppContainer";
import * as utils from "../src/utils";
jest.doMock("../src/utils", () => {
    utils.isDevMode = jest.fn(() => false);
    return utils;
});

afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
});

test("Should create appContainer with no error", () => {
    const appContainer = new AppContainer();
    expect(appContainer).toEqual(expect.any(AppContainer));
});

test("Should destroy appContainer with no error", () => {
    const ComponentManagerRegistry = require("../src/ComponentManagerRegistry")
        .default;
    const mockDestroy = jest.fn();
    jest.doMock("../src/ComponentManagerRegistry", () => {
        return jest.fn().mockImplementation((appContainer, options = {}) => {
            const cr = new ComponentManagerRegistry(appContainer, options);
            cr.destroy = mockDestroy;
            return cr;
        });
    });
    const AppContainer = require("../src/AppContainer").default;
    const appContainer = new AppContainer();
    appContainer.destroy();
    expect(mockDestroy).toHaveBeenCalledTimes(1);
});

test("Use devtool compose func by default in development mode", () => {
    const utils = require("../src/utils");
    const { compose } = require("redux");
    utils.isDevMode.mockImplementation(() => true);
    const devtoolComposer = jest.fn(compose);
    global.window = {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => devtoolComposer
    };
    new AppContainer();
    expect(devtoolComposer).toHaveBeenCalledTimes(1);
});

test("Do Not Use devtool compose func by default in production mode", () => {
    const utils = require("../src/utils");
    const { compose } = require("redux");
    utils.isDevMode.mockImplementation(() => false);
    const devtoolComposer = jest.fn(compose);
    global.window = {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => devtoolComposer
    };
    new AppContainer();
    expect(devtoolComposer).toHaveBeenCalledTimes(0);
});

test("Use devtool compose func in production mode if `reduxDevToolsDevOnly` is false", () => {
    const utils = require("../src/utils");
    const { compose } = require("redux");
    utils.isDevMode.mockImplementation(() => false);
    const devtoolComposer = jest.fn(compose);
    global.window = {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => devtoolComposer
    };
    new AppContainer({
        reduxDevToolsDevOnly: false
    });
    expect(devtoolComposer).toHaveBeenCalledTimes(1);
});

test("Default devTool `actionSanitizer` & `predicate` option should be used if user doesn't supply", () => {
    const utils = require("../src/utils");
    const { compose } = require("redux");
    utils.isDevMode.mockImplementation(() => true);
    const devComposeCreator = jest.fn(() => compose);
    global.window = {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: devComposeCreator
    };
    new AppContainer({
        devToolOptions: {}
    });
    const devToolOptions = devComposeCreator.mock.calls[0][0];
    expect(typeof devToolOptions.actionSanitizer).toBe("function");
    expect(typeof devToolOptions.predicate).toBe("function");
});

test("Default devTool `actionSanitizer` & `predicate` option can be replaced if user supply one", () => {
    const utils = require("../src/utils");
    const { compose } = require("redux");
    utils.isDevMode.mockImplementation(() => true);
    const devComposeCreator = jest.fn(() => compose);
    global.window = {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: devComposeCreator
    };
    const actionSanitizer = Symbol("userActionSanitizer");
    const predicate = Symbol("userPredicate");
    new AppContainer({
        devToolOptions: {
            actionSanitizer,
            predicate
        }
    });
    const devToolOptions = devComposeCreator.mock.calls[0][0];
    expect(devToolOptions.actionSanitizer).toBe(actionSanitizer);
    expect(devToolOptions.predicate).toBe(predicate);
});
