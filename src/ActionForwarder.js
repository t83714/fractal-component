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
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: `${props.namespace}/io.github.t83714`,
            saga: forwarderSaga
        });
    }

    render() {
        return null;
    }
}

ActionForwarder.propTypes = {
    namespace: PropTypes.string.isRequired,
    pattern: PropTypes.oneOfType([
        PropTypes.string,
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
    transformer: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};

function* forwarderSaga(effects) {
    yield effects.takeEvery(
        this.props.pattern ? this.props.pattern : "*",
        function*(action) {
            const newAction = actionTransformer(action, this.props.transformer);
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
                 * `${props.namespace}/io.github.t83714/${this.componentManager.componentId}`
                 * Add `../../` to `props.relativeDispatchPath` so that relative namespace path
                 * will start from `${props.namespace}`.
                 * This might be easier for people to use `ActionForwarder` as we don't need to 
                 * always add `two levels up` in order to throw action out of `ActionForwarder`
                 */
                const relativeDispatchPath = this.props.relativeDispatchPath
                    ? `../../${this.props.relativeDispatchPath}`
                    : "";
                yield effects.put(newAction, relativeDispatchPath);
            }
        }.bind(this)
    );
}

function actionTransformer(action, transformer) {
    if (!transformer) return action;
    if (is.string(transformer)) return { ...action, type: transformer };
    else if (is.func(transformer)) return transformer(action);
    return action;
}

export default ActionForwarder;
