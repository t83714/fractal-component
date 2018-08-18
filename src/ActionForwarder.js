import React from "react";
import PropTypes from "prop-types";
import * as AppContainerUtils from "./AppContainerUtils";
import { is } from "./utils";
import { put } from "redux-saga/effects";

/**
 * A helper container component used to forward actions to another namespace
 */
class ActionForwarder extends React.Component {
    constructor(props) {
        super(props);
        this.appContainer = AppContainerUtils.getAppContainer();
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714/ActionForwarder",
            saga: forwarderSaga.bind(this)
        });
    }

    render() {
        return null;
    }
}

ActionForwarder.propTypes = {
    namespacePrefix: PropTypes.string.isRequired,
    pattern: PropTypes.oneOfType([
        PropTypes.symbol,
        PropTypes.func,
        PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        )
    ]),
    /**
     * `relativeDispatchPath` will only be used, if `toGlobal` is not true or not supplied
     */
    toGlobal: PropTypes.bool,

    absoluteDispatchPath: PropTypes.string,
    relativeDispatchPath: PropTypes.string,
    transformer: PropTypes.oneOfType([PropTypes.symbol, PropTypes.func])
};

function* forwarderSaga(effects) {
    yield effects.takeEvery(
        this.props.pattern ? this.props.pattern : "*",
        function*(action) {
            //--- avoid forwarder loop
            if (action.currentSenderPath === this.componentManager.fullPath)
                return;
            const newAction = actionTransformer(
                action,
                this.props.transformer
            ).bind(this);
            //--- unnamespace forward
            if (this.props.toGlobal === true) {
                if (this.props.absoluteDispatchPath) {
                    yield put({
                        ...newAction,
                        type: `${this.props.absoluteDispatchPath}/${
                            newAction.type
                        }`
                    });
                } else {
                    yield put(newAction);
                }
            } else {
                //--- namespaced forward
                /**
                 * namespaced forward
                 * `ActionForwarder`'s current namespace path is:
                 * `${props.namespace}/io.github.t83714/ActionForwarder/${this.componentManager.componentId}`
                 * Add `../../../` to `props.relativeDispatchPath` so that relative namespace path
                 * will start from `${props.namespace}`.
                 * This might be easier for people to use `ActionForwarder` as we don't need to
                 * always add `three levels up` in order to throw action out of `ActionForwarder`
                 */
                const relativeDispatchPath = this.props.relativeDispatchPath
                    ? `../../../${this.props.relativeDispatchPath}`
                    : "";
                yield effects.put(newAction, relativeDispatchPath);
            }
        }.bind(this)
    );
}

function actionTransformer(action, transformer) {
    if (!transformer) return action;
    let newAction = action;
    if (is.symbol(transformer)){
        newAction = {
            ...action,
            type: transformer
        };
    }else if (is.func(transformer)){
        newAction = transformer(action);
    }
    if(is.symbol(newAction)){
        newAction.namespace = this.appContainer.actionRegistry.findNamespaceByActionType(newAction.type);
    }
    return newAction;
}

export default ActionForwarder;
