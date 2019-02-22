import { Store, Action, Reducer } from "redux";
import { ObjectHash } from "./getComponentStub";
import ComponentManager, {
    ManageableComponentOptions
} from "../ComponentManager";

export type dispatchFuncType = (
    action: Action,
    relativeDispatchPath?: string
) => Action;

export type useComponentManagerResponse = [
    any,
    dispatchFuncType,
    () => any,
    ComponentManager
] & {
    state: any;
    dispatch: dispatchFuncType;
    getNamespaceData: () => any;
    componentManager: ComponentManager;
};

export default function useComponentManager(
    props: ObjectHash,
    options: ManageableComponentOptions
): useComponentManagerResponse;
