import { SagaItem } from "../SagaRegistry";
import { Task } from "redux-saga";

export declare function initSaga(sagaItem: SagaItem): void;
export declare function cancelSaga(pathOrTask: string | Task);