import * as React from "react";
import { Action } from "redux";
declare class Counter extends React.Component {}
export default Counter;
export interface actionTypes {
    INCREASE_COUNT: symbol;
}
export interface actions {
    increaseCount: () => Action;
}
