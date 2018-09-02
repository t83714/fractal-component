import { Action } from "redux";

declare class ActionRegistry {
    constructor();
    register(namespace: string, actionTypes: symbol | symbol[] | object): void;
    serialiseAction(action: Action): string;
    deserialiseAction(actionJson: string): Action;
    findNamespaceByActionType(actionType: symbol): string;
    destroy(): void;
}

export default ActionRegistry;
