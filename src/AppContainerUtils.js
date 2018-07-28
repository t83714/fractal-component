
import AppContainer from "./AppContainer";

const appContainerStore = {};
let currentAppContainerToken = null;

export const APP_CONATINER_KEY = Symbol("APP_CONATINER_KEY");
export const CONTAINER_LOCAL_KEY = Symbol("CONTAINER_LOCAL_KEY");

export function createAppContainer(options){
    const ac = new AppContainer(options);
    currentAppContainerToken = Symbol("APP_CONTAINER_TOKEN");
    appContainerStore[currentAppContainerToken] = ac;
    return ac;
}

export function getCurrentAppContainerToken(){
    return currentAppContainerToken;
}

export function getAppContainer(){
    if(currentAppContainerToken===null) {
        throw new Error("App Container is not available. You need to create one via `createAppContainer` first.");
    }
    return appContainerStore[currentAppContainerToken];
}

export function destroyAppContainer(refOrToken=null){
    if(typeof refOrToken === "symbol"){
        if(currentAppContainerToken === refOrToken){
            currentAppContainerToken = null;
        }
        if(appContainerStore[refOrToken]){
            appContainerStore[refOrToken].destroy();
        }
        delete appContainerStore[refOrToken];
    }else if(refOrToken){
        Object.keys(appContainerStore).forEach(token=>{
            if(appContainerStore[token]===refOrToken){
                if(appContainerStore[token]){
                    appContainerStore[token].destroy();
                    delete appContainerStore[token];
                }
                if(currentAppContainerToken === token) {
                    currentAppContainerToken = null;
                }
            }
        });
    }else{
        const token = getCurrentAppContainerToken();
        if(!token) return;
        if(appContainerStore[token]){
            appContainerStore[token].destroy();
            delete appContainerStore[token];
        }
        currentAppContainerToken = null;
    }
}

