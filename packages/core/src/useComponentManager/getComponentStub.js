const noop = () => {};

function getComponentStub(
    props,
    context,
    setState = noop,
    componentName = "Component"
) {
    return {
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
