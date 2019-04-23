const noop = () => {};

function getComponentStub(
    state,
    props,
    context,
    setState = noop,
    componentName = "Component"
) {
    return {
        state,
        props,
        render: noop,
        componentDidMount: noop,
        componentWillUnmount: noop,
        setState,
        context,
        constructor: {
            displayName: componentName
        }
    };
}

export default getComponentStub;
