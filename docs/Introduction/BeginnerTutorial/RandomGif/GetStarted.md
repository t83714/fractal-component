### 3.1 Get Started

To start our `RandomGif` component, firstly, we need to create a `RandomGif` folder in `src` folder and then create `index.js` in `RandomGif` with the followings:

```javascript
import React from "react";
import { ComponentManager } from "fractal-component";

class RandomGif extends React.Component {
    constructor(props) {
        super(props);
        this.componentManager = new ComponentManager(this, {
            namespace: "io.github.t83714/RandomGif"
        });
    }

    render() {
        return <div>Hello from RandomGif!</div>;
    }
}

export default RandomGif;
```

Here we define a React Component that may look very similar to an ordinary react class component. The magic comes from the `constructor` method when we create a ComponentManager instance via [new ComponentManager()](../../../api/ComponentManager.md) to register the current component instance to `AppContainer`. Once register, a `Component Container` is created behind the scenes to maintain a more [advanced component structure](../../../api/ComponentManager.md#overview). This more advanced component structure allows you to encapsulate `component state reducer`, `effects management`, `actions / events loop` etc. into a single conceptual container. The `namespace` for our `Component Container` is created as suggested by line:
```javascript
namespace: "io.github.t83714/RandomGif"
```

#### 3.1.1 React Function Component

You can use [React Function Component](https://reactjs.org/docs/components-and-props.html#function-and-class-components) with `fractal-component` as well via [useComponentManager Hook](../../../api/useComponentManager.md). Here is an example:

```javascript
import React from "react";
import { useComponentManager } from "fractal-component";

function RandomGif(props){

    const [ state, dispatch ] = useComponentManager(props, {
        namespace: "io.github.t83714/RandomGif"
    });

    render() {
        return <div>Hello from RandomGif!</div>;
    }
}

export default RandomGif;
```


Next, to render this newly created component, you can modify `src/main.js` to import it:
```javascript
import "@babel/polyfill";

import React from "react";
import ReactDOM from "react-dom";
import RandomGif from "./RandomGif";

ReactDOM.render(<RandomGif />, document.getElementById("root"));
```

Now, if you run the App by `npm start` & access `http://localhost:3000/`, you should see:
```
Hello from RandomGif!
```

So far, our component looks pretty much similar to an ordinary React component. However, behind the scenes, a [ComponentManager](../../../api/ComponentManager.md) instance (the `Component Container`) has been created for this component and it's running in a portable private `namespace`: `io.github.t83714/RandomGif`.