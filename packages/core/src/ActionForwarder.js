import React from "react";
import PropTypes from "prop-types";
import * as AppContainerUtils from "./AppContainerUtils";
import { is } from "./utils";

/**
 * A helper container component used to forward actions to another namespace
 */
class ActionForwarder extends React.Component {
    constructor(props) {
        super(props);
        this.appContainer = AppContainerUtils.getAppContainer();
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714/ActionForwarder",
            saga: forwarderSaga.bind(this),
            // --- By default, component will not accept any incoming multicast action.
            // --- "*" will allow any action types to be accepted
            // --- No limit to actions that are sent out
            allowedIncomingMulticastActionTypes: "*"
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
            const newAction = actionTransformer.call(
                this,
                action,
                this.props.transformer
            );
            //--- namespaced forward
            /**
             * namespaced forward
             * `ActionForwarder`'s current namespace path is:
             * `${props.namespacePrefix}/io.github.t83714/ActionForwarder/${this.componentManager.componentId}`
             * Add `../../../` to `props.relativeDispatchPath` so that relative namespace path
             * will start from `${props.namespace}`.
             * This might be easier for people to use `ActionForwarder` as we don't need to
             * always add `three levels up` in order to throw action out of `ActionForwarder`
             */
            const relativeDispatchPath = this.props.relativeDispatchPath
                ? `../../../${this.props.relativeDispatchPath}`
                : "";
            yield effects.put(newAction, relativeDispatchPath);
        }.bind(this)
    );
}

function actionTransformer(action, transformer) {
    if (!transformer) return action;
    let newAction = action;
    if (is.symbol(transformer)) {
        newAction = {
            ...action,
            type: transformer
        };
    } else if (is.func(transformer)) {
        newAction = transformer(action);
    }
    return newAction;
}

export default ActionForwarder;
