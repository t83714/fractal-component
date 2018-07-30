import { normalize } from "./PathRegistry";

export function objectByPathSet(obj, path, value) {
    path = normalize(path);
    let ref = obj;
    const parts = path.split("/");
    parts.forEach((p, idx) => {
        if (idx === parts.length - 1) ref[p] = value;
        else if (typeof ref[p] === "undefined") ref[p] = {};
        ref = ref[p];
    });
}
export function objectByPathDelete(obj, path) {
    path = normalize(path);
    let ref = obj;
    const parts = path.split("/");
    const objAccessStack = [];
    parts.forEach((p, idx) => {
        if (idx > 0) objAccessStack.push([p,ref[p]]);
        if (idx === parts.length - 1) delete ref[p];
        else if (typeof ref[p] === "undefined") return;
        ref = ref[p];
    });
    if(objAccessStack.length){
        const reverse = objAccessStack.reverse();
        for(let i=0;i<objAccessStack.length; i++){
            if(!Object.keys(objAccessStack[i]).length){
                //delete 
            }
        }
    }
    objAccessStack.reverse()
}
export function objectByPathExist(obj, path) {}
export function objectByPathGet(obj, path) {}
