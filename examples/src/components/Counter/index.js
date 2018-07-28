import * as React from 'react'
import PropTypes from 'prop-types'
import { AppContainerUtils } from "../../../../src/index";

class Couter extends React.Component{
    constructor(){
        //AppContainerUtils.
    }

    render(){
        return (<p>
            Clicked: {value} times <button onClick={onIncrement}>+</button> <button onClick={onDecrement}>-</button>{' '}
            <button onClick={onIncrementIfOdd}>Increment if odd</button>{' '}
            <button onClick={onIncrementAsync}>Increment async</button>
        </p>);
    }
}

const Counter = ({ value, onIncrement, onIncrementAsync, onDecrement, onIncrementIfOdd }) => (
  <p>
    Clicked: {value} times <button onClick={onIncrement}>+</button> <button onClick={onDecrement}>-</button>{' '}
    <button onClick={onIncrementIfOdd}>Increment if odd</button>{' '}
    <button onClick={onIncrementAsync}>Increment async</button>
  </p>
)

Counter.propTypes = {
  initValue: PropTypes.number
}

export default Counter
