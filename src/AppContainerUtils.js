
import AppContainer from "./AppContainer";

const appContainerStore = {};
let currentAppContainerToken = null;

const AppContainerUtils = {
    APP_CONATINER_KEY = Symbol("APP_CONATINER_KEY"),
    CONTAINER_LOCAL_KEY = Symbol("CONTAINER_LOCAL_KEY"),
    createAppContainer,
    getCurrentAppContainerToken,
    getAppContainer,
    destroyAppContainer
};

function createAppContainer(options){
    const ac = new AppContainer(options);
    currentAppContainerToken = Symbol("APP_CONTAINER_TOKEN");
    appContainerStore[currentAppContainerToken] = ac;
    return ac;
}

function getCurrentAppContainerToken(){
    return currentAppContainerToken;
}

function getAppContainer(){
    if(currentAppContainerToken===null) {
        throw new Error("App Container is not available. You need to create one via `createAppContainer` first.");
    }
    return appContainerStore[currentAppContainerToken];
}

function destroyAppContainer(ref){
    if(typeof ref === "symbol"){
        if(currentAppContainerToken === ref){
            currentAppContainerToken = null;
            if(appContainerStore[currentAppContainerToken]){
                appContainerStore[currentAppContainerToken].destroy();
            }
            delete appContainerStore[currentAppContainerToken];
        }
    }else{
        Object.keys(appContainerStore).map(token=>{
            if(appContainerStore[token]===ref){
                appContainerStore[currentAppContainerToken].destroy();
                delete appContainerStore[currentAppContainerToken];
            }
        });
    }
}


export default AppContainerUtils;