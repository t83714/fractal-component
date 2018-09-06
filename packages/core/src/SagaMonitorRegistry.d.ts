import { Monitor } from "redux-saga";

declare class SagaMonitorRegistry {
    constructor();
    register(moniter: Monitor): void;
    deregister(moniter: Monitor): void;
    getCombinedMonitor(): Monitor;
    destroy(): void;
}

export default SagaMonitorRegistry;
