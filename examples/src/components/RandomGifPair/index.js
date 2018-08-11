import * as React from "react";
import { create as jssCreate } from "jss";
import jssDefaultPreset from "jss-preset-default";
import color from "color";
//-- import fractal-component lib from src entry point
import { AppContainerUtils, ActionForwarder } from "../../../../src/index";
import RandomGif from "../RandomGif";

const styles = {
    table: {
        display: "flex",
        "flex-wrap": "wrap",
        margin: "0.2em 0.2em 0.2em 0.2em",
        padding: 0,
        "flex-direction": "column",
        width: "41em"
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
        "flex-direction": "row",
        "align-items": "center",
        "justify-content": "space-evenly",
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

const jss = jssCreate(jssDefaultPreset());
const { classes } = jss.createStyleSheet(styles).attach();

class RandomGifPair extends React.Component {
    constructor(props) {
        super(props);
        this.componentManager = AppContainerUtils.registerComponent(this, {
            namespace: "io.github.t83714"
        });
    }

    render() {
        return (
            <div className={classes.table}>
                <div className={classes.cell}>RandomGif Pair</div>
                <div className={`${classes.cell}`}>
                    <div>
                        <RandomGif
                            showButton={false}
                            namespacePrefix={`${
                                this.componentManager.fullPath
                            }/Gifs`}
                        />
                    </div>
                    <div>
                        <RandomGif
                            showButton={false}
                            namespacePrefix={`${
                                this.componentManager.fullPath
                            }/Gifs`}
                        />
                    </div>
                </div>
                {this.props.showButton && (
                    <div className={`${classes.cell} `}>
                        <button
                            onClick={() => {
                                this.componentManager.dispatch(
                                    { type: "REQUEST_NEW_GIF" },
                                    `./Gifs/*`
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
                {/**
                 * Use ActionForwarder to throw NEW_GIF out of RandomGifPair container
                 * Set namespace to `${this.componentManager.fullPath}/Gifs` in order to listen to
                 * all `out of box` actions from two `RandomGif` components
                 * Here, we don't need (shouldn't) to use a `transformer` to make any changes to actions because:
                 * - As a component author, we are not supposed to know any component is more interested in `INCREASE_COUNT` actions
                 * - There is an `ActionForwarder` outside this box already and will do all transformation job
                 */}
                {
                    <ActionForwarder
                        namespacePrefix={`${
                            this.componentManager.fullPath
                        }/Gifs`}
                        pattern="NEW_GIF"
                        relativeDispatchPath="../../../*"
                    />
                }
            </div>
        );
    }
}

RandomGifPair.defaultProps = {
    showButton: true
};

export default RandomGifPair;
