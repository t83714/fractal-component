import { Store, Action, Reducer } from "redux";
import { ObjectHash } from "./getComponentStub";
import ComponentManager, {
    ManageableComponentOptions
} from "../ComponentManager";

type dispatchFuncType = (
    action: Action,
    relativeDispatchPath?: string
) => Action;

export type useComponentManagerResponse = [
    any,
    dispatchFuncType,
    ComponentManager
] & {
    state: any;
    dispatch: dispatchFuncType;
    componentManager: ComponentManager;
};

export default function useComponentManager(
    props: ObjectHash,
    options: ManageableComponentOptions
): useComponentManagerResponse;
