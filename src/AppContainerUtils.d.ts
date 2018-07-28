import AppContainer from "./AppContainer";

export = AppContainerUtils;

declare namespace AppContainerUtils {
    declare const APP_CONATINER_KEY: Symbol;
    declare const CONTAINER_LOCAL_KEY: Symbol;
    declare function createAppContainer(options:AppContainer.AppContainerOption):AppContainer;
    declare function getCurrentAppContainerToken():Symbol;
    declare function getAppContainer():AppContainer;
    declare function destroyAppContainer(ref:Symbol|AppContainer):void;
}
