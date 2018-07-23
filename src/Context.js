import React from "react";

const AppContainerContext = React.createContext({
    appContainer: null,
    store: null
});

export const Provider = AppContainerContext.Provider;
export const Consumer = AppContainerContext.Consumer;

export default AppContainerContext;
