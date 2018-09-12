import React from "react";
import { Action } from "redux";
declare class Counter extends React.Component {}
export default Counter;
export declare interface actionTypes {
    INCREASE_COUNT: Symbol;
}
export declare interface actions {
    increaseCount: () => Action;
}
