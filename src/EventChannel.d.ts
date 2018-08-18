import { Channel, Buffer, END } from "redux-saga";
import { Action } from "redux";

type Emitter = (input: any | END) => void;

declare class EventChannel {
    constructor(buffers?: Buffer<Action>);
    subscribe(emitter: Emitter): void;
    unsubscribe(emitter: Emitter): void;
    dispatch(event: any): void;
    destroy(): void;
    create(): Channel<any>;
}

export default EventChannel;
