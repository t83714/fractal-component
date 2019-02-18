import { Channel, Buffer, END } from "redux-saga";
import { Action } from "redux";

type Emitter = (input: Action | END) => void;

declare class EventChannel {
    constructor(buffers?: Buffer<Action>);
    subscribe(emitter: Emitter): void;
    unsubscribe(emitter: Emitter): void;
    dispatch(event: Action): void;
    destroy(): void;
    create(): Channel<Action>;
}

export default EventChannel;
