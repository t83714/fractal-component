import React from "react";
import hoistNonReactStatic from "hoist-non-react-statics";
import { Consumer } from "./Context";

const defaultOptions = {
  saga: null,
  initState: {},
  persistState: false
};

const createContainerComponent = function(options) {
  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
  }

  return function(WrappedComponent) {
    class EnhancedContainerComponent extends React.Component {
      constructor(props) {}

      componentDidMount() {}

      componentWillUnmount() {}
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
            store={theme}
            appContainer={appContainer}
          />
        )}
      </Consumer>
    );
  };
};
