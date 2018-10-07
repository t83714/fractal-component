### 4.1 Get Started

To start our `RandomGifPair` component, firstly, we need to create a `RandomGifPair` folder in `src` folder and then create stlye file `index.js` in `RandomGifPair/styles`. Its content can be found from [here](https://github.com/t83714/fractal-component-beginner-tutorial/blob/master/src/RandomGifPair/styles/index.js)

Next, we need to create the component entry point `index.js` in `RandomGifPair` with the followings:

```javascript
import React from "react";
import PropTypes from "prop-types";
import { AppContainerUtils, AppContainer } from "fractal-component";
import RandomGif, { actions as randomGifActions, actionTypes as randomGifActionTypes } from "../RandomGif";

import jss from "jss";
import jssDefaultPreset from "jss-preset-default";
import styles from "./styles";

class RandomGifPair extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714/RandomGifPair",
            namespaceInitCallback: componentManager => {
                const styleSheet = jss
                    .setup(jssDefaultPreset())
                    .createStyleSheet(props.styles ? props.styles : styles, {
                        generateClassName: componentManager.createClassNameGenerator()
                    })
                    .attach();
                return { styleSheet };
            },
            namespaceDestroyCallback: ({ styleSheet }) => {
                styleSheet.detach();
            }
        });
    }

    render() {
        const { styleSheet } = this.componentManager.getNamespaceData();
        const { classes } = styleSheet;
        return (
            <div className={classes.table}>
                <div className={classes.cell}>RandomGif Pair</div>
                <div className={`${classes.cell}`}>
                    <div>
                        <RandomGif
                            showButton={false}
                            apiKey={this.props.apiKey}
                            namespacePrefix={`${
                                this.componentManager.fullPath
                            }/Gifs`}
                            // --- pass down appContainer in case users want to specify `appContainer`
                            appContainer={this.props.appContainer}
                        />
                    </div>
                    <div>
                        <RandomGif
                            showButton={false}
                            apiKey={this.props.apiKey}
                            namespacePrefix={`${
                                this.componentManager.fullPath
                            }/Gifs`}
                            // --- pass down appContainer in case users want to specify `appContainer`
                            appContainer={this.props.appContainer}
                        />
                    </div>
                </div>
                {this.props.showButton && (
                    <div className={`${classes.cell} `}>
                        <button
                            onClick={() => {
                                this.componentManager.dispatch(
                                    randomGifActions.requestNewGif(),
                                    // --- sent multicast actions 
                                    // --- and flow down to all namespace paths under `${this.componentManager.fullPath}/Gifs/`
                                    "./Gifs/*"
                                );
                            }}
                            disabled={this.state.isLoading}
                        >
                            {this.state.isLoading
                                ? "Loading..."
                                : "Get Gif Pair"}
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

RandomGifPair.propTypes = {
    showButton: PropTypes.bool,
    apiKey: PropTypes.string,
    styles: PropTypes.object,
    appContainer: PropTypes.instanceOf(AppContainer)
};

RandomGifPair.defaultProps = {
    showButton: true
};

export default RandomGifPair;
```

In `index.js`, we imported component `RandomGif` and configure it as:
```jsx
<RandomGif
    // --- hide `RandomGif`'s button
    showButton={false}
    apiKey={this.props.apiKey}
    namespacePrefix={`${
        this.componentManager.fullPath
    }/Gifs`}
    // --- pass down appContainer in case users want to specify `appContainer`
    appContainer={this.props.appContainer}
/>
```
Here, we set `namespacePrefix` to `${this.componentManager.fullPath}/Gifs` so that the namespace path of `RandomGif` components included by our new `RandomGifPair` will be always under `RandomGifPair`'s namespace path. The actual `Namespace Tree` structure is shown as below:

![NamespaceTreeRandomGifPair](../assets/BeginnerTutorial/NamespaceTreeRandomGifPair.png)

From the `Namespace Tree` structure, we can tell that to send multicast actions to both `RandomGif` components, we just need to dispatch to `relativeDispatchPath`: `./Gifs/*`. Thus, in `index.js`, we use the following code to dispatch `REQUEST_NEW_GIF` actions to `RandomGif` components when the button is clicked:
```javascript
this.componentManager.dispatch(
    randomGifActions.requestNewGif(),
    "./Gifs/*"
);
```


Next, to render this newly created component, you can modify `src/main.js` to import it:
```javascript
import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import RandomGif from "./RandomGif";
import RandomGifPair from "./RandomGifPair";

ReactDOM.render(
    <div>
        <div>
            <RandomGif />
        </div>
        <div>
            <RandomGifPair />
        </div>
    </div>,
    document.getElementById("root")
);
```

Now, if you run the App by `npm start` & access `http://localhost:3000/`, you should see both `RandomGif` & the newly created `RandomGifPair` component.