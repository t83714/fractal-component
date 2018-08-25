import { getPackageName } from "../utils";
export const INIT_STATE = Symbol(`@@${getPackageName()}/INIT_STATE`);
export const EMPTY_STATE = Symbol(`@@${getPackageName()}/EMPTY_STATE`);