import { addReducer } from "./ReducerRegistry/actions";
import { ADD_REDUCER } from "./ReducerRegistry/actionTypes";

const defaultOptions = {
    initState: {}
};

const globalReducer = function(state, action){
    if(!action.type) return state;
    switch(action.type){
        case ADD_REDUCER : 
            //
    }
};

class ReducerRegistry {

    constructor(appContainer) {
        this.appContainer = appContainer;
        this.reducerList = [];
        this.appContainer = appContainer;
        this.addReducer()
    }

    addReducer(reducerItem) {
        this.reducerList = this.reducerList.filter(item => item.reducer !== reducerItem.reducer);
        this.reducerList.push(reducerItem);
        this.appContainer.store.dispatch(addReducer(reducerItem));
    }
}
