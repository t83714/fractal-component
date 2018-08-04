import { Channel, Buffer } from "redux-saga";

type Emitter = (input: any | END) => void;

declare class EventChannel {
    constructor(buffers: Buffer = null):void;
    subscribe(emitter: Emitter): void;
    unsubscribe(emitter: Emitter): void;
    dispatch(event: any): void;
    destroy():void;
    create(): Channel<any>;
}

export default EventChannel;