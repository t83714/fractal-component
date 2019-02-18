import { SagaItem } from "../SagaRegistry";
import { Task } from "redux-saga";
import { Action } from "redux";

export function initSaga(sagaItem: SagaItem): Action;
export function cancelSaga(pathOrTask: string | Task): Action;
