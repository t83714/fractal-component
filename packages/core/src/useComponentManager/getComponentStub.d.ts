export interface ObjectHash {
    [k: string]: any;
}

export type AnyFunc = (...args: any[]) => any;

export interface ComponentStub {
    props: ObjectHash;
    context: any;
    setState: AnyFunc;
    componentDidMount: () => void;
    componentWillUnmount: () => void;
    render: () => void;
    constructor: {
        displayName: string;
    };
}

declare function getComponentStub(
    props: ObjectHash,
    context: any,
    setState?: AnyFunc,
    componentName?: string
): ComponentStub;

export default getComponentStub;
