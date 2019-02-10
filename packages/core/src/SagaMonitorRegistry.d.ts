import { SagaMonitor } from "redux-saga";

declare class SagaMonitorRegistry {
    constructor();
    register(moniter: SagaMonitor): void;
    deregister(moniter: SagaMonitor): void;
    getCombinedMonitor(): SagaMonitor;
    destroy(): void;
}

export default SagaMonitorRegistry;
