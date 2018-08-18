import PathRegistry, { normalize, NAMESPACED } from "./PathRegistry";
import { is } from "./utils";

export default class ActionRegistry {
    constructor() {
        this.pathRegistry = new PathRegistry();
    }

    register(namespace, actions) {
        namespace = normalize(namespace);
        let newActionList = {};
        if (is.symbol(actions)) {
            newActionList[String(actions)] = actions;
        } else if (is.array(actions) && actions.length) {
            actions.forEach(action => {
                if (!is.symbol(action)) {
                    throw new Error(
                        "ActionRegistry: Action type must be a symbol."
                    );
                }
                newActionList[String(action)] = action;
            });
        } else if (is.object(actions)) {
            Object.keys(actions).forEach(key => {
                if (!is.symbol(actions[key])) {
                    throw new Error(
                        "ActionRegistry: Action type must be a symbol."
                    );
                }
                newActionList[String(actions[key])] = actions[key];
            });
        } else {
            throw new Error(
                "ActionRegistry: Actions must be a symbol or a list / array of symbols."
            );
        }

        if (this.pathRegistry.exist(namespace)) {
            const data = this.pathRegistry.getPathData(namespace);
            const actionList = Object.assign(
                {},
                is.object(data.actionList) ? data.actionList : {},
                newActionList
            );
            this.pathRegistry.setPathData(namespace, { ...data, actionList });
        } else {
            this.pathRegistry.add(namespace, { actionList: newActionList });
        }
    }

    serialiseAction(action) {
        if (!is.action(action)) {
            throw new Error(
                "serialiseAction: Cannot action parameter is not a valid Action."
            );
        }
        const { namespace, type } = action;
        if (!namespace) {
            throw new Error(
                "serialiseAction: Cannot locate namespace property from action parameter"
            );
        }
        const { actionList } = this.pathRegistry.getPathData(namespace);
        if (
            !is.object(actionList) ||
            !Object.keys(actionList).length ||
            !Object.values(actionList).indexOf(action) === -1
        ) {
            throw new Error(
                "serialiseAction: the action type is not register yet."
            );
        }

        const newAction = {
            ...action,
            type : String(type),
        };
        if(action[NAMESPACED] === true) {
            newAction[String(NAMESPACED)] = true;
        }
        return JSON.stringify(newAction);
    }

    deserialiseAction(actionJson){
        const action = JSON.parse(actionJson);
        if(!action || !action.namespace) {
            throw new Error("Cannot deserialise action without namespace property!");
        }
        if(action[String(NAMESPACED)] === true){
            action[NAMESPACED] = true;
        }
        const { actionList } = this.pathRegistry.getPathData(action.namespace);
        if(!is.object(actionList)){
            throw new Error("Cannot deserialise unregistered action!");
        }
        const type = actionList[action.type];
        if(!type) {
            throw new Error("Cannot deserialise unregistered action!");
        }
        action.type = type;
        return action;
    }
}
