import SharedStateContainer from "./SharedStateContainer";

export default function createSharedState(options) {
    return new SharedStateContainer(options);
}
