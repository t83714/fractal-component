import React from "react";
import { Action } from "redux";
declare class RandomGif extends React.Component {}
export default RandomGif;
export declare interface actionTypes {
    NEW_GIF: Symbol;
    LOADING_START: Symbol;
    LOADING_COMPLETE: Symbol;
    REQUEST_NEW_GIF: Symbol;
}
export declare interface actions {
    requestNewGif: () => Action;
}
