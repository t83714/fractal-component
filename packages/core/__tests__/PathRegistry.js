import PathRegistry, { PathContext } from "../src/PathRegistry";
import sampleData from "./sampleData/exampleAppPathRegistryData.json";

const actionTypes = {
    "Symbol(REQUEST_NEW_GIF)": Symbol("REQUEST_NEW_GIF"),
    "Symbol(REQUEST_NEW_PAIR)": Symbol("REQUEST_NEW_PAIR"),
    "Symbol(REQUEST_NEW_PAIR_PAIR)": Symbol("REQUEST_NEW_PAIR_PAIR")
};

test("`map` method should travel through all paths & pathData and relevant result in an array", () => {
    const pathRegistry = new PathRegistry(true);
    initPathRegistryWithSampleData(pathRegistry, false);
    const pathMarkingSheet = {};
    const pathMappingValues = {};
    sampleData.paths.forEach(path => {
        pathMarkingSheet[path] = false;
        pathMappingValues[path] = Math.floor(Math.random() * 1000);
    });
    const r = pathRegistry.map((data, path) => {
        expect(sampleData.dataStore[path]).toBeDefined();
        expect(data).toEqual(sampleData.dataStore[path]);
        expect(pathMarkingSheet[path]).toBeDefined();
        pathMarkingSheet[path] = true;
        return pathMappingValues[path];
    });
    Object.keys(pathMarkingSheet).forEach(path => {
        expect(pathMarkingSheet[path]).toEqual(true);
    });
    Object.keys(pathMappingValues).forEach(path => {
        expect(r.indexOf(pathMappingValues[path]) !== -1).toEqual(true);
    });
});

test("`KeepOrder` PathRegistry should keep all paths in asc ordering by its string length", () => {
    const pathRegistry = new PathRegistry(true);
    initPathRegistryWithSampleData(pathRegistry);
    for (let i = 0; i < pathRegistry.paths.length - 1; i++) {
        expect(
            pathRegistry.paths[i + 1].length >= pathRegistry.paths[i].length
        ).toEqual(true);
    }
});

describe("Multicast actions should not be dispatched to a container if the action type is not on its parent's `allowedIncomingMulticastActionTypes` list", () => {
    test("Multicast `REQUEST_NEW_GIF` action dispatched at root should only be received by `RandomGif` with no parents", () => {
        const pathRegistry = new PathRegistry(true);
        initPathRegistryWithSampleData(pathRegistry);
        const pathContext = new PathContext("");
        const action = pathContext.convertNamespacedAction(
            {
                type: actionTypes["Symbol(REQUEST_NEW_GIF)"]
            },
            "*"
        );
        const dispatchResult = pathRegistry.searchDispatchPaths(action);
        /**
         * All other RandomGifs included by others Components (e.g RandomGifPair or RandomGifPairPair)
         * won't receive the actions as their parants (i.e. RandomGifPair or RandomGifPairPair)
         * are not interested in multicast actions with that type (set by allowedIncomingMulticastActionTypes)
         */
        const expectedPath = [
            "exampleApp/RandomGif/io.github.t83714/RandomGif/jlk5zo17"
        ];
        expect(dispatchResult).toEqual(expect.arrayContaining(expectedPath));
        expect(expectedPath).toEqual(expect.arrayContaining(dispatchResult));
    });

    test("Multicast `REQUEST_NEW_PAIR` action dispatched at root should only be received by `RandomGifPair` with no parents", () => {
        const pathRegistry = new PathRegistry(true);
        initPathRegistryWithSampleData(pathRegistry);
        const pathContext = new PathContext("");
        const action = pathContext.convertNamespacedAction(
            {
                type: actionTypes["Symbol(REQUEST_NEW_PAIR)"]
            },
            "*"
        );
        const dispatchResult = pathRegistry.searchDispatchPaths(action);
        /**
         * All other RandomGifPair included by others Components (e.g RandomGifPairPair)
         * won't receive the actions as their parants (i.e. RandomGifPairPair)
         * are not interested in multicast actions with that type (set by allowedIncomingMulticastActionTypes)
         */
        const expectedPath = [
            "exampleApp/RandomGifPair/io.github.t83714/RandomGifPair/jlk5zo1e"
        ];
        expect(dispatchResult).toEqual(expect.arrayContaining(expectedPath));
        expect(expectedPath).toEqual(expect.arrayContaining(dispatchResult));
    });

    test("Multicast `REQUEST_NEW_GIF` action dispatched at `exampleApp` should only be received by `RandomGif` with no parents", () => {
        const pathRegistry = new PathRegistry(true);
        initPathRegistryWithSampleData(pathRegistry);
        const pathContext = new PathContext("");
        const action = pathContext.convertNamespacedAction(
            {
                type: actionTypes["Symbol(REQUEST_NEW_GIF)"]
            },
            "exampleApp/*"
        );
        const dispatchResult = pathRegistry.searchDispatchPaths(action);
        /**
         * All other RandomGifs included by others Components (e.g RandomGifPair or RandomGifPairPair)
         * won't receive the actions as their parants (i.e. RandomGifPair or RandomGifPairPair)
         * are not interested in multicast actions with that type (set by allowedIncomingMulticastActionTypes)
         */
        const expectedPath = [
            "exampleApp/RandomGif/io.github.t83714/RandomGif/jlk5zo17"
        ];
        expect(dispatchResult).toEqual(expect.arrayContaining(expectedPath));
        expect(expectedPath).toEqual(expect.arrayContaining(dispatchResult));
    });

    test("Multicast `REQUEST_NEW_PAIR` action dispatched at `exampleApp` should only be received by `RandomGifPair` with no parents", () => {
        const pathRegistry = new PathRegistry(true);
        initPathRegistryWithSampleData(pathRegistry);
        const pathContext = new PathContext("");
        const action = pathContext.convertNamespacedAction(
            {
                type: actionTypes["Symbol(REQUEST_NEW_PAIR)"]
            },
            "exampleApp/*"
        );
        const dispatchResult = pathRegistry.searchDispatchPaths(action);
        /**
         * All other RandomGifPair included by others Components (e.g RandomGifPairPair)
         * won't receive the actions as their parants (i.e. RandomGifPairPair)
         * are not interested in multicast actions with that type (set by allowedIncomingMulticastActionTypes)
         */
        const expectedPath = [
            "exampleApp/RandomGifPair/io.github.t83714/RandomGifPair/jlk5zo1e"
        ];
        expect(dispatchResult).toEqual(expect.arrayContaining(expectedPath));
        expect(expectedPath).toEqual(expect.arrayContaining(dispatchResult));
    });
});

describe("Verify `RandomGifPair` component related logic", () => {
    test("Dispatched `REQUEST_NEW_GIF` action should be heard by two `RandomGif` components", () => {
        const pathRegistry = new PathRegistry(true);
        initPathRegistryWithSampleData(pathRegistry);
        const pathContext = new PathContext(
            "exampleApp/RandomGifPair/io.github.t83714/RandomGifPair/jlk5zo1e"
        );
        const action = pathContext.convertNamespacedAction(
            {
                type: actionTypes["Symbol(REQUEST_NEW_GIF)"]
            },
            "./Gifs/*"
        );
        const dispatchResult = pathRegistry.searchDispatchPaths(action);
        const expectedPath = [
            "exampleApp/RandomGifPair/io.github.t83714/RandomGifPair/jlk5zo1e/Gifs/io.github.t83714/RandomGif/jlk5zo1g",
            "exampleApp/RandomGifPair/io.github.t83714/RandomGifPair/jlk5zo1e/Gifs/io.github.t83714/RandomGif/jlk5zo1f",
            "exampleApp/RandomGifPair/io.github.t83714/RandomGifPair/jlk5zo1e/Gifs/io.github.t83714/ActionForwarder/jlk5zo1i",
            "exampleApp/RandomGifPair/io.github.t83714/RandomGifPair/jlk5zo1e/Gifs/io.github.t83714/ActionForwarder/jlk5zo1h"
        ];
        expect(dispatchResult).toEqual(expect.arrayContaining(expectedPath));
        expect(expectedPath).toEqual(expect.arrayContaining(dispatchResult));
    });
});

function initPathRegistryWithSampleData(
    pathRegistry,
    deserialiseSymbol = true
) {
    sampleData.paths.forEach(path => {
        if (!deserialiseSymbol) {
            pathRegistry.add(path, sampleData.dataStore[path]);
            return;
        }
        const pathData = { ...sampleData.dataStore[path] };
        if (pathData.allowedIncomingMulticastActionTypes !== "*") {
            pathData.allowedIncomingMulticastActionTypes = pathData.allowedIncomingMulticastActionTypes.map(
                type => actionTypes[type]
            );
        }
        pathRegistry.add(path, pathData);
    });
}
