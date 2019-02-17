import { getPackageName } from "./utils/pkgUtils";

export const APP_CONTAINER_SYMBOL = Symbol("APP_CONTAINER_SYMBOL");
// -- for identify a namespaced action; import by PathRegistry
export const NAMESPACED = Symbol(`@@${getPackageName()}/NAMESPACED`);
