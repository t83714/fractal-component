import React from "react";
import hoistNonReactStatic from "hoist-non-react-statics";
import { Consumer } from "./Context";
import { runSaga as createRunSagaEvent } from "./AppContainer/actions";
import uniqid from "uniqid";
import runSagaSlient from "./utils/runSagaSlient";

const defaultOptions = {
    saga: null,
    initState: {},
    namespace: null,
    namespacePrefix: null,
    componentId: null,
    persistState: false
};

const getDisplayName = function(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

const initComponent = function*() {};

const componentControllingSaga = function*(
    containerCreationOptions,
    WrappedComponent
) {};

const settleStringSetting = function(setting) {
    if (!setting) return null;
    if (typeof setting === "function") {
        try {
            const value = setting.bind(
                this,
                this.componentDisplayName,
                this.WrappedComponent
            )();
            if (!value) return null;
            return value;
        } catch (e) {
            console.log(
                `Failed to retrieve setting via executing generating function: ${e.getMessage()}`
            );
            return null;
        }
    } else {
        return String(setting);
    }
};

const createContainerComponent = function(options) {
    const containerCreationOptions = {
        ...defaultOptions,
        ...(options ? options : {})
    };

    return function(WrappedComponent) {
        class EnhancedContainerComponent extends React.Component {
            constructor(props) {
                this.componentDisplayName = getDisplayName(WrappedComponent);
                const settleStringSettingFunc = settleStringSetting.bind(this);
                this.namespace = settleStringSettingFunc(
                    containerCreationOptions.namespace
                );
                this.isRandomComponentId = false;
                this.componentId = settleStringSettingFunc(
                    containerCreationOptions.componentId
                );
                if (this.componentId.indexOf("/") !== -1)
                    throw new Error("Component ID cannot contain `/`.");
                if (!this.componentId) {
                    this.isRandomComponentId = true;
                    this.componentId = uniqid(`${this.componentDisplayName}-`);
                }
                this.namespacePrefix = settleStringSettingFunc(
                    containerCreationOptions.namespacePrefix
                );
                this.fullNamespacePath = this.getFullNamespacePath();
                this.fullNodePath = this.getFullNodePath();
            }

            getFullNamespacePath() {
                const parts = ["@@FC"];
                if (this.namespacePrefix) parts.push(this.namespacePrefix);
                if (this.namespace) parts.push(this.namespace);
                return parts.join("/");
            }

            getFullNodePath() {
                return `${this.fullNamespacePath}/${this.componentId}`;
            }

            componentDidMount() {
                this.props.appContainer.sendChanEvent(
                    createRunSagaEvent(
                        [this, componentControllingSaga],
                        containerCreationOptions,
                        WrappedComponent
                    )
                );
            }

            componentWillUnmount() {}

            render() {
                <WrappedComponent {...this.props} />;
            }
        }
        hoistNonReactStatic(EnhancedContainerComponent, WrappedComponent);
        EnhancedContainerComponent.displayName = `EnhancedContainerComponent(${getDisplayName(
            WrappedComponent
        )})`;
        return props => (
            <Consumer>
                {({ store, appContainer }) => (
                    <EnhancedContainerComponent
                        {...props}
                        store={store}
                        appContainer={appContainer}
                    />
                )}
            </Consumer>
        );
    };
};
