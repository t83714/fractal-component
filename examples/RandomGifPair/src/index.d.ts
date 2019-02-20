import * as React from "react";
import { Action } from "redux";
declare class RandomGifPair extends React.Component {}
export default RandomGifPair;
export interface actionTypes {
    NEW_GIF: symbol;
    LOADING_START: symbol;
    LOADING_COMPLETE: symbol;
    REQUEST_NEW_PAIR: symbol;
}
export interface actions {
    requestNewPair: () => Action;
}
