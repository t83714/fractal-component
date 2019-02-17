import { getPackageName } from "./utils/pkgUtils";

// -- for identify a namespaced action; import by PathRegistry
export const NAMESPACED = Symbol(`@@${getPackageName()}/NAMESPACED`);
// -- for accessing a component manager from a component instance
export const COMPONENT_MANAGER_ACCESS_KEY = Symbol(
    "COMPONENT_MANAGER_ACCESS_KEY"
);
