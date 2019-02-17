import PathRegistry, { normalize } from "./PathRegistry";
import { NAMESPACED } from "./symbols";
import { is, symbolToString } from "./utils";

const standardliseActionTypesParameter = function(actionTypes) {
    let newActionList = {};
    if (is.symbol(actionTypes)) {
        newActionList[symbolToString(actionTypes)] = actionTypes;
    } else if (is.array(actionTypes) && actionTypes.length) {
        actionTypes.forEach(actionType => {
            if (!is.symbol(actionType)) {
                throw new Error(
                    "ActionRegistry: Action type must be a symbol."
                );
            }
            newActionList[symbolToString(actionType)] = actionType;
        });
    } else if (is.object(actionTypes)) {
        Object.keys(actionTypes).forEach(key => {
            if (!is.symbol(actionTypes[key])) {
                throw new Error(
                    "ActionRegistry: Action type must be a symbol."
                );
            }
            newActionList[symbolToString(actionTypes[key])] = actionTypes[key];
        });
    } else {
        throw new Error(
            "ActionRegistry: actionTypes must be a symbol or a list / array of symbols."
        );
    }
    return newActionList;
};

export default class ActionRegistry {
    constructor() {
        this.pathRegistry = new PathRegistry();
    }

    destroy() {
        this.pathRegistry.destroy();
    }

    isNamespaceExist(namespace) {
        namespace = normalize(namespace);
        return this.pathRegistry.exist(namespace);
    }

    register(namespace, actionTypes) {
        namespace = normalize(namespace);

        const newActionList = standardliseActionTypesParameter(actionTypes);

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

    deregister(namespace, actionTypes = null) {
        namespace = normalize(namespace);
        if (!this.pathRegistry.exist(namespace)) return;
        if (!actionTypes) {
            this.pathRegistry.remove(namespace);
        } else {
            const newActionList = Object.values(
                standardliseActionTypesParameter(actionTypes)
            );
            let { actionList } = this.pathRegistry.getPathData(namespace);
            const actionListKeys = Object.keys(actionList).filter(
                key => newActionList.indexOf(actionList[key]) === -1
            );
            if (!actionListKeys.length) {
                this.pathRegistry.remove(namespace);
            } else {
                actionListKeys.forEach(key => {
                    delete actionList[key];
                });
                this.pathRegistry.setPathData({ actionList });
            }
        }
    }

    findNamespaceByActionType(actionType) {
        return this.pathRegistry.searchPathByPathData(
            ({ actionList }) =>
                Object.values(actionList).indexOf(actionType) !== -1
        );
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
            type: symbolToString(type)
        };
        if (action[NAMESPACED] === true) {
            newAction[symbolToString(NAMESPACED)] = true;
        }
        return JSON.stringify(newAction);
    }

    deserialiseAction(actionJson) {
        const action = JSON.parse(actionJson);
        if (!action || !action.namespace) {
            throw new Error(
                "Cannot deserialise action without namespace property!"
            );
        }
        if (action[symbolToString(NAMESPACED)] === true) {
            action[NAMESPACED] = true;
        }
        const { actionList } = this.pathRegistry.getPathData(action.namespace);
        if (!is.object(actionList)) {
            throw new Error("Cannot deserialise unregistered action!");
        }
        const type = actionList[action.type];
        if (!type) {
            throw new Error("Cannot deserialise unregistered action!");
        }
        action.type = type;
        return action;
    }
}
