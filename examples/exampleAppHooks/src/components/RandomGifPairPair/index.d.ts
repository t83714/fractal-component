import * as React from "react";
import { Action } from "redux";
declare class RandomGifPairPair extends React.Component {}
export default RandomGifPairPair;
export interface actionTypes {
    NEW_GIF: symbol;
    LOADING_START: symbol;
    LOADING_COMPLETE: symbol;
    REQUEST_NEW_PAIR_PAIR: symbol;
}
export interface actions {
    requestNewPairPair: () => Action;
}
