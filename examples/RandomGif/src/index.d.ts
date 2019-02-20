import * as React from "react";
import { Action } from "redux";
declare class RandomGif extends React.Component {}
export default RandomGif;
export interface actionTypes {
    NEW_GIF: symbol;
    LOADING_START: symbol;
    LOADING_COMPLETE: symbol;
    REQUEST_NEW_GIF: symbol;
}
export interface actions {
    requestNewGif: () => Action;
}
