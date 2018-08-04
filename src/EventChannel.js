import { eventChannel, buffers as bufferFactory } from "redux-saga";

class EventChannel {
    constructor(buffer = null) {
        if (!buffer) {
            this.buffer = bufferFactory.sliding(10);
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

    destroy(){
        this.eventEmitters = [];
    }

    create() {
        return eventChannel(emitter => {
            this.subscribe(emitter);
            return () => {
                this.unsubscribe(emitter);
            };
        }, this.buffer);
    }
}

export default EventChannel;
