### 3.5 Styling / Component Namespace Data

So far, our `RandomGif` component doesn't come with any styles. Of course, we can style our component using traditional global CSS files. However, here, we recommended the `In-Component Styling` approach using [JSS library](http://cssinjs.org). Besides the benefits described [here](http://cssinjs.org/benefits), more importantly, this approach allows us to encapsulate our component UI without any impact to the global CSS space.

To style our component, we firstly need to write our component style CSS in [JSON format](http://cssinjs.org/json-api)(in file `src/RandomGif/styles/index.js`):
```javascript
import color from "color"; // --- use `color` lib for color caclulation
const styles = {
    table: {
        display: "flex",
        "flex-wrap": "wrap",
        margin: "0.2em 0.2em 0.2em 0.2em",
        padding: 0,
        "flex-direction": "column",
        width: "20em"
    },
    cell: {
        "box-sizing": "border-box",
        "flex-grow": 1,
        width: "100%",
        overflow: "hidden",
        padding: "0.2em 0.2em",
        border: `solid 2px ${color("slategrey").fade(0.5)}`,
        "border-bottom": "none",
        "background-color": "#f7f7f7",
        display: "flex",
        "align-items": "center",
        "justify-content": "center",
        "&:last-child": {
            "border-bottom": `solid 2px ${color("slategrey").fade(
                0.5
            )} !important`
        }
    },
    "image-container": {
        height: "15em"
    },
    image: {
        width: "100%",
        height: "100%"
    }
};
export default styles;
```

To create CSS stylesheet from the `JSON format stylesheet declaration` and attach to browser global CSS space, we generally need the following code:
```javascript
import jss from "jss";
import jssDefaultPreset from "jss-preset-default";
import styles from "./styles";

const styleSheet = jss.setup(jssDefaultPreset()) // --- setup a JSS instance with with default plugins
.createStyleSheet(styles)  // --- Compile styles
.attach(); // --- render to browser, insert it into DOM
```

If we want to remove the compiled stylesheet from browser, we can:
```javascript
styleSheet.detach();
```

We can't simply copy those into our component's `index.js` as we want to make sure:
- Styles are only compiled & insert into DOM once. 
    -  No matter how many component instances are mounted. Styles are only compile when the first instance are mounted.
- Styles are removed from browser only after all instances of the component are unmounted.

To achieve that, we can use the `Component Namespace Data` & `Component Namespace Life Cycle Callback` feature of `fractal-component`. When we register our React Component using [AppContainerUtils.registerComponent](../../../api/AppContainerUtils.md#appcontainerutilsregistercomponent) method, we can opt to register `namespaceInitCallback` & `namespaceDestroyCallback` through [ManageableComponentOptions](../../../api/AppContainer.md#manageablecomponentoptions).

- `namespaceInitCallback`: this callback will only be called once when `Component Namespace` `io.github.t83714/RandomGif` has just been created (it's also the time when the first instance of the registered React Component is mounted). Moreover, any value you return from this callback will be kept as `Component Namespace Data` and can be retrieved anytime before the namespace is destroyed using [ComponentManager.getNamespaceData()](../../../api/ComponentManager.md) method.
- `namespaceDestroyCallback`: this callback will only be called once after `Component Namespace` `io.github.t83714/RandomGif` is destroyed (it's also the time when the last instance of the the registered React Component is unmounted). You will receive the `Component Namespace Data` as the only parameter of the callback function.

To setup the stylesheet for our component, we can modify `src/RandomGif/index.js` to the followings:

```javascript
import React from "react";
import { AppContainerUtils } from "fractal-component";
import * as actionTypes from "./actions/types";
import reducer from "./reducers";
import * as actions from "./actions";
import saga from "./sagas";
import jss from "jss";
import jssDefaultPreset from "jss-preset-default";
import styles from "./styles";

class RandomGif extends React.Component {
    constructor(props) {
        super(props);
        // --- initialise component state
        this.state = {
            isLoading: false,
            imageUrl: null,
            error: null
        };
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714/RandomGif",
            // --- register all action types so that actions are serialisable
            actionTypes,
            reducer,
            saga,
            namespaceInitCallback: componentManager => {
                const styleSheet = jss
                    .setup(jssDefaultPreset())
                    .createStyleSheet(styles, {
                        generateClassName: componentManager.createClassNameGenerator()
                    })
                    .attach();
                // --- store `styleSheet` as `Component Namespace Data`
                return { styleSheet }; 
            },
            namespaceDestroyCallback: ({ styleSheet }) => {
                // --- received previously returned `Component Namespace Data` as the only parameter
                // --- remove stylesheet from browser
                styleSheet.detach();
            }
        });
    }

    render() { ... }
}
export default RandomGif;
```

Next, we need to update `render()` method to use our stylesheet:

```javascript
render() {
    // --- retrieve styleSheet from `Component Namespace Data`
    const { styleSheet } = this.componentManager.getNamespaceData();
    // --- get all class names included in this stylesheet
    const { classes } = styleSheet;
    return (
        <div className={classes.table}>
            <div className={classes.cell}>RandomGif</div>
            <div
                className={`${classes.cell} ${classes["image-container"]}`}
            >
                {this.state.imageUrl &&
                    !this.state.isLoading &&
                    !this.state.error && (
                        <img
                            alt="Gif"
                            src={this.state.imageUrl}
                            className={`${classes.image}`}
                        />
                    )}
                {(!this.state.imageUrl || this.state.isLoading) &&
                    !this.state.error && (
                        <p>
                            {this.state.isLoading
                                ? "Requesting API..."
                                : "No GIF loaded yet!"}
                        </p>
                    )}
                {this.state.error && (
                    <p>{`Failed to request API: ${this.state.error}`}</p>
                )}
            </div>
            <div className={`${classes.cell} `}>
                <button
                    onClick={() => {
                        this.componentManager.dispatch(
                            actions.requestNewGif()
                        );
                    }}
                    disabled={this.state.isLoading}
                >
                    {this.state.isLoading ? "Requesting API..." : "Get Gif"}
                </button>
            </div>
        </div>
    );
}
```

If you run the app via `npm start`, you will find that the component now comes with styles as shown below:

![RandomGifSec3.5](../../../assets/BeginnerTutorial/RandomGifSec3.5.png)