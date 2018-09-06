import AppContainer from "./AppContainer";
import { Store, Action } from "redux";
import { Channel, Task } from "redux-saga";

declare class SagaRegistry {
    constructor(appContainer: AppContainer);

    appContainer: AppContainer;
    namespacedSagaItemStore: SagaItem[];
    globalSagaTaskList: Task[];

    register(saga: GeneratorFunction, sagaOptions: SagaOptions): Task;
    deregister(pathOrTask: string | Task): void;
    createHostSaga(): GeneratorFunction;
    destroy(): void;
}

export default SagaRegistry;

export interface SagaOptions {
    path?: string;
    namespace: string;
    allowedIncomingMulticastActionTypes?: symbol[] | symbol | string;
}

export interface SagaItem extends SagaOptions {
    saga: GeneratorFunction;
    chan?: Channel<Action>;
    task?: Task;
}
