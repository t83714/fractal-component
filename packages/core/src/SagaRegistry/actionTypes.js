import { getPackageName } from "../utils";
export const INIT_SAGA = Symbol(`@@${getPackageName()}/INIT_SAGA`);
export const CANCEL_SAGA = Symbol(`@@${getPackageName()}/CANCEL_SAGA`);
