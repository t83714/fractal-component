import React from "react";
import PropTypes from "prop-types";
import { is } from "../utils";
import { put } from "redux-saga/effects";
/**
 * A helper container component used to forward actions to another namespace
 */
class ActionForwarder extends React.Component {
    constructor(props) {
        super(props);
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714/ActionForwarder",
            saga: forwarderSaga
        });
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
    yield takeEvery(this.props.pattern ? this.props.pattern : "*", function*(
        action
    ) {
        const newAction = actionTransformer(action, this.props.transformer);
        //--- unnamespace forward
        if (this.props.toGlobal === true) {
            if (this.props.absoluteDispatchPath) {
                yield put({
                    ...newAction,
                    type: `${this.props.absoluteDispatchPath}/${newAction.type}`
                });
            } else {
                yield put(newAction);
            }
        } else {
            //--- namespaced forward
            yield effects.put(newAction, this.props.relativeDispatchPath);
        }
    });
}

function actionTransformer(action, transformer) {
    if (!transformer) return action;
    if (is.string(transformer)) return { ...action, type: transformer };
    else if (is.func(transformer)) return transformer(action);
    return action;
}

export default ActionForwarder;