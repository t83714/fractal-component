import { Store, Action, Reducer } from "redux";
import { ObjectHash } from "./getComponentStub";
import ComponentManager, {
    ManageableComponentOptions
} from "../ComponentManager";

export default function useComponentManager(
    props: ObjectHash,
    options: ManageableComponentOptions
): [
    any,
    (action: Action, relativeDispatchPath?: string) => Action,
    ComponentManager
];
