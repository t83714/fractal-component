import color from "color";

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
        },
        "&$button-container": {
            height: "16.5em",
            "& button": {
                "font-size": "32px"
            },
            "& $active": {
                "background-color": "green",
                color: "white"
            },
            "& $inactive": {
                "background-color": "red",
                color: "white"
            }
        }
    },
    "button-container": {},
    active: {},
    inactive: {}
};

export default styles;
