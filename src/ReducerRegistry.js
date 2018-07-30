import { addReducer } from "./ReducerRegistry/actions";
import { ADD_REDUCER } from "./ReducerRegistry/actionTypes";

import { normalize } from "./PathRegistry";

const defaultOptions = {
    initState: {}
};

const globalReducer = function(state, action) {
    if (!action.type) return state;
    switch (action.type) {
        case ADD_REDUCER:
        //
    }
};

class ReducerRegistry {
    constructor(store) {
        this.store = store;
        this.reducerStore = {};
        this.addReducer();
    }

    register({ path, initState, reducer, overwriteInitState }) {
        if( typeof overwriteInitState !== "boolean") overwriteInitState = true;
        if (!initState) initState = {};
        if (!path) throw new Error("Failed to register namespaced reducer: namespace path cannot be empty!");
        path = normalize(path);
        if(this.reducerStore[path]) throw new Error(`Failed to register namespaced reducer: given path \`${path}\` has been registered.`);
        this.reducerStore[path] = reducer;

        setInitState.call(this, path, initState, overwriteInitState);

        this.reducerList = this.reducerList.filter(
            item => item.reducer !== reducerItem.reducer
        );
        this.reducerList.push(reducerItem);
        this.appContainer.store.dispatch(addReducer(reducerItem));
    }
}

function setInitState(path, initState, overwriteInitState){
    const state = this.store.getState();
    
}
