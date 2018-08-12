import { is as reduxSagaIs, GuardPredicate } from "redux-saga/utils";

const extraIs: {
    bool: GuardPredicate<boolean>;
};

export const is: (typeof extraIs & typeof reduxSagaIs);
