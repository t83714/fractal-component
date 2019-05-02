import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import delay from "../../utils/delay";
import { AppContainer, AppContainerContext, is } from "fractal-component";
import createComponentA from "./Components/ComponentA";
import { initState as initStateComponentA } from "./Components/ComponentA/reducers";
import * as actionsComponentA from "./Components/ComponentA/actions";
import * as actionTypesComponentA from "./Components/ComponentA/actions/types";
import createComponentB from "./Components/ComponentB";
import { initState as initStateComponentB } from "./Components/ComponentB/reducers";
import * as actionsComponentB from "./Components/ComponentB/actions";
import * as actionTypesComponentB from "./Components/ComponentB/actions/types";

import SharedStateA from "./SharedStates/SharedStateA";
import SharedStateB from "./SharedStates/SharedStateB";

import * as actionsSharedStateA from "./SharedStates/SharedStateA/actions";
import * as actionsSharedStateB from "./SharedStates/SharedStateB/actions";

import { initState as initStateSharedStateA } from "./SharedStates/SharedStateA/reducers";
import { initState as initStateSharedStateB } from "./SharedStates/SharedStateB/reducers";

let wrapper = null;
const appContainer = new AppContainer();
const store = appContainer.store;

afterAll(() => {
    if (wrapper) {
        wrapper.unmount();
    }
    appContainer.destroy();
});

describe("Test SharedState with React Hooks", () => {
    let componentAStateData = null;
    let componentBStateData = null;
    let componentADispatch = null;
    let componentBDispatch = null;
    let componentASagaStateData = null;
    let componentBSagaStateData = null;

    const ComponentA = createComponentA(
        {
            sharedStateA: SharedStateA,
            sharedStateB: SharedStateB
        },
        function*(effects) {
            yield effects.takeEvery(
                actionTypesComponentA.TAKE_STATE_SNAPSHOT,
                function*() {
                    componentASagaStateData = yield effects.select();
                }
            );
        },
        (state, dispatch) => {
            componentAStateData = state;
            componentADispatch = dispatch;
            return <div>test</div>;
        }
    );
    const ComponentB = createComponentB(
        {
            sharedStateA: SharedStateA,
            sharedStateB: SharedStateB
        },
        function*(effects) {
            yield effects.takeEvery(
                actionTypesComponentB.TAKE_STATE_SNAPSHOT,
                function*() {
                    componentBSagaStateData = yield effects.select();
                }
            );
        },
        (state, dispatch) => {
            componentBStateData = state;
            componentBDispatch = dispatch;
            return <div>test</div>;
        }
    );

    act(() => {
        wrapper = mount(
            <AppContainerContext.Provider value={appContainer}>
                <div>
                    <ComponentA />
                    <ComponentB />
                </div>
            </AppContainerContext.Provider>
        );
    });

    function testStateData(
        description,
        setup,
        globalStoreDataComponentA,
        globalStoreDataComponentB,
        globalStoreDataSharedStateA,
        globalStoreDataSharedStateB
    ) {
        describe(description, () => {
            let storeData = null;

            async function init() {
                if (is.func(setup)) setup();
                await delay();
                storeData = store.getState();
            }

            function cleanup() {
                componentAStateData = null;
                componentBStateData = null;
                componentASagaStateData = null;
                componentBSagaStateData = null;
            }

            store.getState();

            it("All shared states should have correct state data in global redux store", async () => {
                await init();

                expect(
                    storeData["@SharedState"]["io.github.t83714"][
                        "SharedStateA"
                    ]["c0"]
                ).toEqual(globalStoreDataSharedStateA);

                expect(
                    storeData["@SharedState"]["io.github.t83714"][
                        "SharedStateB"
                    ]["c0"]
                ).toEqual(globalStoreDataSharedStateB);
            });

            it("All components should have correct initial state (without including shared state data) in global redux store", async () => {
                await delay();
                expect(
                    storeData["io.github.t83714"]["ComponentA"]["c0"]
                ).toEqual(globalStoreDataComponentA);

                expect(
                    storeData["io.github.t83714"]["ComponentB"]["c0"]
                ).toEqual(globalStoreDataComponentB);
            });

            it("All React components local state data should include shared stata data", async () => {
                await delay();

                act(() => {
                    componentADispatch(actionsComponentA.forceRender());
                    componentBDispatch(actionsComponentB.forceRender());
                });

                expect(componentAStateData).toEqual({
                    ...globalStoreDataComponentA,
                    sharedStateA: globalStoreDataSharedStateA,
                    sharedStateB: globalStoreDataSharedStateB
                });

                expect(componentBStateData).toEqual({
                    ...globalStoreDataComponentB,
                    sharedStateA: globalStoreDataSharedStateA,
                    sharedStateB: globalStoreDataSharedStateB
                });
            });

            it("State data returned by effects.select() in component saga should include shared stata data", async () => {
                await delay();
                act(() => {
                    componentADispatch(actionsComponentA.takeStateSnapshot());
                });
                await delay();
                expect(componentASagaStateData).toEqual({
                    ...globalStoreDataComponentA,
                    sharedStateA: globalStoreDataSharedStateA,
                    sharedStateB: globalStoreDataSharedStateB
                });

                act(() => {
                    componentBDispatch(actionsComponentB.takeStateSnapshot());
                });
                await delay();
                expect(componentBSagaStateData).toEqual({
                    ...globalStoreDataComponentB,
                    sharedStateA: globalStoreDataSharedStateA,
                    sharedStateB: globalStoreDataSharedStateB
                });

                cleanup();
            });
        });
    }

    testStateData(
        "Test initial state data in global redux store & Local React state",
        null,
        initStateComponentA(),
        initStateComponentB(),
        initStateSharedStateA(),
        initStateSharedStateB()
    );

    (() => {
        const componentAExpectedState = initStateComponentA();
        componentAExpectedState.a.a1[0] += 1;
        testStateData(
            "Increase ComponentA Count then test state data in global redux store & Local React state",
            () => {
                act(() => {
                    componentADispatch(actionsComponentA.increaseCount());
                });
            },
            componentAExpectedState,
            initStateComponentB(),
            initStateSharedStateA(),
            initStateSharedStateB()
        );
    })();

    (() => {
        const componentAExpectedState = initStateComponentA();
        componentAExpectedState.a.a1[0] += 1;
        const componentBExpectedState = initStateComponentB();
        componentBExpectedState.b.b1 = componentBExpectedState.b.b1 + 1;
        testStateData(
            "Increase ComponentB Count then test state data in global redux store & Local React state",
            () => {
                act(() => {
                    componentBDispatch(actionsComponentB.increaseCount());
                });
            },
            componentAExpectedState,
            componentBExpectedState,
            initStateSharedStateA(),
            initStateSharedStateB()
        );
    })();

    (() => {
        const componentAExpectedState = initStateComponentA();
        componentAExpectedState.a.a1[0] += 1;
        const componentBExpectedState = initStateComponentB();
        componentBExpectedState.b.b1 = componentBExpectedState.b.b1 + 1;

        let stateSharedStateAExpectedState = [1];
        testStateData(
            "Increase StateSharedStateA Count (From ComponentA)then test state data in global redux store & Local React state",
            () => {
                act(() => {
                    componentADispatch(actionsSharedStateA.increaseCount());
                });
            },
            componentAExpectedState,
            componentBExpectedState,
            stateSharedStateAExpectedState,
            initStateSharedStateB()
        );
    })();

    (() => {
        const componentAExpectedState = initStateComponentA();
        componentAExpectedState.a.a1[0] += 1;
        const componentBExpectedState = initStateComponentB();
        componentBExpectedState.b.b1 = componentBExpectedState.b.b1 + 1;

        const stateSharedStateAExpectedState = [1];
        const stateSharedStateBExpectedState = {
            count: 1
        };
        testStateData(
            "Increase StateSharedStateB Count (From ComponentA)then test state data in global redux store & Local React state",
            () => {
                act(() => {
                    componentADispatch(actionsSharedStateB.increaseCount());
                });
            },
            componentAExpectedState,
            componentBExpectedState,
            stateSharedStateAExpectedState,
            stateSharedStateBExpectedState
        );
    })();

    (() => {
        const componentAExpectedState = initStateComponentA();
        componentAExpectedState.a.a1[0] += 1;
        const componentBExpectedState = initStateComponentB();
        componentBExpectedState.b.b1 = componentBExpectedState.b.b1 + 1;

        const stateSharedStateAExpectedState = [2];
        const stateSharedStateBExpectedState = {
            count: 1
        };
        testStateData(
            "Increase StateSharedStateA Count (From ComponentB)then test state data in global redux store & Local React state",
            () => {
                act(() => {
                    componentBDispatch(actionsSharedStateA.increaseCount());
                });
            },
            componentAExpectedState,
            componentBExpectedState,
            stateSharedStateAExpectedState,
            stateSharedStateBExpectedState
        );
    })();

    (() => {
        const componentAExpectedState = initStateComponentA();
        componentAExpectedState.a.a1[0] += 1;
        const componentBExpectedState = initStateComponentB();
        componentBExpectedState.b.b1 = componentBExpectedState.b.b1 + 1;

        const stateSharedStateAExpectedState = [2];
        const stateSharedStateBExpectedState = {
            count: 2
        };
        testStateData(
            "Increase StateSharedStateB Count (From ComponentB)then test state data in global redux store & Local React state",
            () => {
                act(() => {
                    componentBDispatch(actionsSharedStateB.increaseCount());
                });
            },
            componentAExpectedState,
            componentBExpectedState,
            stateSharedStateAExpectedState,
            stateSharedStateBExpectedState
        );
    })();
});
