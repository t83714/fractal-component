import React from "react";
import { Action } from "redux";
declare class RandomGifPair extends React.Component {}
export default RandomGifPair;
export declare interface actionTypes {
    NEW_GIF: Symbol;
    LOADING_START: Symbol;
    LOADING_COMPLETE: Symbol;
    REQUEST_NEW_PAIR: Symbol;
}
export declare interface actions {
    requestNewPair: () => Action;
}
