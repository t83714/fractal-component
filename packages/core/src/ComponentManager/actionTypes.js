import { getPackageName } from "../utils";
export const INITD = Symbol(`@@${getPackageName()}/INITD`);
export const DESTROY = Symbol(`@@${getPackageName()}/DESTROY`);