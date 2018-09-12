import React from "react";
import { Action } from "redux";
declare class RandomGifPairPair extends React.Component {}
export default RandomGifPairPair;
export declare interface actionTypes {
    NEW_GIF: Symbol;
    LOADING_START: Symbol;
    LOADING_COMPLETE: Symbol;
    REQUEST_NEW_PAIR_PAIR: Symbol;
}
export declare interface actions {
    requestNewPairPair: () => Action;
}
