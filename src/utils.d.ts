import { is as reduxSagaIs } from "redux-saga/utils";

interface extraIs extends reduxSagaIs{
    bool: GuardPredicate<boolean>;
}

export const is: extraIs;
