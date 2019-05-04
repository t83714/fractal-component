import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import delay from "../../utils/delay";
import {
    AppContainer,
    useComponentManager,
    AppContainerContext
} from "fractal-component";
import * as actionTypes from "./actions/types";
import * as actions from "./actions";

import TestSharedState from "./TestSharedState";
import * as actionsTestSharedState from "./TestSharedState/actions";

import { initState as initTestStateSharedState } from "./TestSharedState/reducers";

let appContainer = null;
let wrapper = null;
let sagaRetrievedStateData = null;
let componentLocalStateData = null;
let componentDispatchFunc = null;

const TestComponent = props => {
    const [state, dispatch] = useComponentManager(props, {
        namespace: "io.github.t83714/TestComponent",
        sharedStates: {
            TestSharedState
        },
        actionTypes,
        saga
    });
    componentLocalStateData = state;
    componentDispatchFunc = dispatch;
    return <div>test!</div>;
};

function* saga(effects) {
    yield effects.takeEvery(actionTypes.TAKE_STATE_SNAPSHOT, function*() {
        const a = 1 + 1;
        const x = yield effects.select();
        sagaRetrievedStateData = yield effects.select();
        const b = 1 + 1;
    });
}

beforeAll(() => {
    appContainer = new AppContainer();
});

afterAll(() => {
    if (wrapper) {
        wrapper.unmount();
    }
    if (appContainer) {
        appContainer.destroy();
        appContainer = null;
    }
});

describe("Test React Function Component without setting initial state & reducer", () => {
    it("Test Component state without setting initial state & reducer should be initialised with no error", () => {
        act(() => {
            wrapper = mount(
                <AppContainerContext.Provider value={appContainer}>
                    <div>
                        <TestComponent />
                    </div>
                </AppContainerContext.Provider>
            );
        });
    });

    it("Test Component state in global store should be `undefined` if no initial state & reducer set", () => {
        const state = appContainer.store.getState();
        expect(state["io.github.t83714"]).toBeUndefined();
    });

    it("Checking Test Component state data via saga", async () => {
        expect(typeof componentDispatchFunc).toEqual("function");
        act(() => {
            componentDispatchFunc(actions.takeStateSnapshot());
        });
        await delay();
        expect(sagaRetrievedStateData).toEqual({
            TestSharedState: initTestStateSharedState()
        });
    });

    it("Checking Test Component local state data", () => {
        expect(componentLocalStateData).toEqual({
            TestSharedState: initTestStateSharedState()
        });
    });

    it("Increase count in TestSharedState", () => {
        expect(typeof componentDispatchFunc).toEqual("function");
        act(() => {
            componentDispatchFunc(actionsTestSharedState.increaseCount());
        });
    });

    it("Checking Test Component global store state data after count increased", () => {
        const state = appContainer.store.getState();
        expect(state["io.github.t83714"]).toBeUndefined();
    });

    it("Checking Test Component state data via saga after count increased", async () => {
        expect(typeof componentDispatchFunc).toEqual("function");
        act(() => {
            componentDispatchFunc(actions.takeStateSnapshot());
        });
        await delay();
        expect(sagaRetrievedStateData).toEqual({
            TestSharedState: [1]
        });
    });
});
