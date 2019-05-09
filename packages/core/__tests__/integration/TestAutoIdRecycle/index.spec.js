import React from "react";
import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import delay from "../../utils/delay";
import { AppContainer, AppContainerContext, is } from "fractal-component";
import ListComponet from "./ListComponet";
import * as actions from "./ListComponet/actions";

let appContainer = null;
let wrapper = null;

beforeAll(() => {
    appContainer = new AppContainer();
    act(() => {
        wrapper = mount(
            <AppContainerContext.Provider value={appContainer}>
                <div>
                    <ListComponet />
                </div>
            </AppContainerContext.Provider>
        );
    });
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

function retrieveIdCountsFromState(state) {
    return Object.keys(state["io.github.t83714"]["ItemComponent"]).map(cid =>
        parseInt(cid.replace(/^c/, ""))
    );
}

describe("Test Auto Component ID recycling", () => {
    it("Initialise multiple ItemComponents state data", () => {
        act(() => {
            appContainer.dispatch(
                actions.setData([1, 1, 1, 1, 1]),
                "io.github.t83714/ListComponent/c0"
            );
        });
        const state = appContainer.store.getState();
        const idCounts = retrieveIdCountsFromState(state);
        expect(idCounts).toEqual(expect.arrayContaining([0, 1, 2, 3, 4]));
    });

    it("Umount the second one", () => {
        act(() => {
            appContainer.dispatch(
                actions.setData([1, 0, 1, 1, 1]),
                "io.github.t83714/ListComponent/c0"
            );
        });
        const state = appContainer.store.getState();
        const idCounts = retrieveIdCountsFromState(state);
        expect(idCounts).toEqual(expect.arrayContaining([0, 2, 3, 4]));
    });

    it("Umount the 4th one", () => {
        act(() => {
            appContainer.dispatch(
                actions.setData([1, 0, 1, 0, 1]),
                "io.github.t83714/ListComponent/c0"
            );
        });
        const state = appContainer.store.getState();
        const idCounts = retrieveIdCountsFromState(state);
        expect(idCounts).toEqual(expect.arrayContaining([0, 2, 4]));
    });

    it("Umount the 5th one", () => {
        act(() => {
            appContainer.dispatch(
                actions.setData([1, 0, 1, 0, 0]),
                "io.github.t83714/ListComponent/c0"
            );
        });
        const state = appContainer.store.getState();
        const idCounts = retrieveIdCountsFromState(state);
        expect(idCounts).toEqual(expect.arrayContaining([0, 2]));
    });

    it("Mount the 5th one", () => {
        act(() => {
            appContainer.dispatch(
                actions.setData([1, 0, 1, 0, 1]),
                "io.github.t83714/ListComponent/c0"
            );
        });
        const state = appContainer.store.getState();
        const idCounts = retrieveIdCountsFromState(state);
        expect(idCounts).toEqual(expect.arrayContaining([0, 2, 3]));
    });

    it("Umount all & Mount 5th", () => {
        act(() => {
            appContainer.dispatch(
                actions.setData([0, 0, 0, 0, 0]),
                "io.github.t83714/ListComponent/c0"
            );
        });
        act(() => {
            appContainer.dispatch(
                actions.setData([0, 0, 0, 0, 1]),
                "io.github.t83714/ListComponent/c0"
            );
        });
        const state = appContainer.store.getState();
        const idCounts = retrieveIdCountsFromState(state);
        expect(idCounts).toEqual(expect.arrayContaining([0]));
    });
});
