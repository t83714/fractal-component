import { Action } from "redux";

declare class ActionRegistry {
    constructor();
    register(namespace: string, actions: symbol | symbol[] | object): void;
    serialiseAction(action: Action): string;
    deserialiseAction(actionJson: string): Action;
}

export default ActionRegistry;
