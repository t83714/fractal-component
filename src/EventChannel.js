import { eventChannel, buffers as bufferFactory } from "redux-saga";
import { kTrue } from "./utils";

class EventChannel {
    constructor(buffer = null) {
        if (!buffer) {
            this.buffer = bufferFactory.expanding();
        } else {
            this.buffer = buffer;
        }

        this.eventEmitters = [];
    }

    subscribe(emitter) {
        this.unsubscribe(emitter);
        this.eventEmitters.push(emitter);
    }

    unsubscribe(emitter) {
        this.eventEmitters = this.eventEmitters.filter(
            item => item !== emitter
        );
    }

    dispatch(event) {
        this.eventEmitters.forEach(emitter => emitter(event));
    }

    destroy() {
        this.eventEmitters = [];
    }

    create(matcher) {
        return eventChannel(
            emitter => {
                this.subscribe(emitter);
                return () => {
                    this.unsubscribe(emitter);
                };
            },
            this.buffer,
            matcher ? matcher : kTrue
        );
    }
}

export default EventChannel;
