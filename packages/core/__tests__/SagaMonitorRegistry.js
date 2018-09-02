import SagaMonitorRegistry from "../src/SagaMonitorRegistry";

const monitorKeys = [
    "effectTriggered",
    "effectResolved",
    "effectRejected",
    "effectCancelled",
    "actionDispatched"
];

function testMonitorProperties(monitor) {
    expect(typeof monitor).toBe("object");
    monitorKeys.forEach(key => {
        expect(typeof monitor[key]).toBe("function");
    });
}

test("Empty registry should return with all callable combined monitors", () => {
    const sagaMoniterRegistry = new SagaMonitorRegistry();
    const combinedMonitor = sagaMoniterRegistry.getCombinedMonitor();
    testMonitorProperties(combinedMonitor);
    monitorKeys.forEach(key => combinedMonitor[key]());
});

function testSingleMonitor(monitorType, ...args){
    test(`Combined monitor Should pass required parameters to all registered \`${monitorType}\` monitors`, () => {
        const sagaMoniterRegistry = new SagaMonitorRegistry();
        const mockFunc1 = jest.fn();
        const mockFunc2 = jest.fn();
        sagaMoniterRegistry.register({
            [monitorType]: mockFunc1
        });
        sagaMoniterRegistry.register({
            [monitorType]: mockFunc2
        });
        const combinedMonitor = sagaMoniterRegistry.getCombinedMonitor();
        testMonitorProperties(combinedMonitor);
        combinedMonitor[monitorType](...args);
        expect(mockFunc1).toHaveBeenCalledWith(...args);
    });
}

testSingleMonitor("effectTriggered", {});
testSingleMonitor("effectResolved", 1, {});
testSingleMonitor("effectRejected", 1, new Error());
testSingleMonitor("effectCancelled", 1);
testSingleMonitor("actionDispatched", {
    type: Symbol("test"),
    payload: {}
});