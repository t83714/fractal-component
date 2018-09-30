import { SagaItem } from "../SagaRegistry";
import { Task } from "redux-saga";
import { Action } from "redux";

export declare function initSaga(sagaItem: SagaItem): Action;
export declare function cancelSaga(pathOrTask: string | Task): Action;