import AppContainer from "./AppContainer";
import { Store } from "redux";
import { Channel, Task } from "redux-saga";

declare class SagaRegistry {
    constructor();

    namespacedSagaItemStore: SagaItem[];
    globalSagaTaskList: Task[];

    register(saga: GeneratorFunction, sagaOptions: SagaOptions): Task;
    deregister(pathOrTask: string | Task): void;
    createHostSaga(): GeneratorFunction;
}

export default SagaRegistry;

export interface SagaOptions {
    path?: string;
    buffer?: Buffer;
    chan?: Channel;
}

export interface SagaItem extends SagaOptions {
    saga: GeneratorFunction;
    task?: Task;
}
