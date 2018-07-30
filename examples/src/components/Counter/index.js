import * as React from 'react'
import PropTypes from 'prop-types'
import {} from "../../sagas/index"
//-- import fractal-component lib from src entry point
import { AppContainerUtils, AppContainer } from "../../../../src/index";

class Counter extends React.Component{
    constructor(props){
        super(props);
        this.componentManager = AppContainerUtils.registerComponent(this);
    }

    componentDidMount(){
        console.log("counter componentDidMount");
        console.log(this);
    }

    componentWillUnmount(){
        console.log("counter componentWillUnmount");
        console.log(this);
    }

    render(){
        return (<p>
            Clicked: {this.props.initValue} times <button onClick={console.log("Increment")}>+</button> <button onClick={console.log("onDecrement")}>-</button>{' '}
            <button onClick={console.log("Increment if odd")}>Increment if odd</button>{' '}
            <button onClick={console.log("Increment async")}>Increment async</button>
        </p>);
    }
}

Counter.displayName = "CunterNewName";

Counter.propTypes = {
  initValue: PropTypes.number
}

export default Counter
