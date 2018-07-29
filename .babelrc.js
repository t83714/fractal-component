const { NODE_ENV, BABEL_ENV } = process.env;

const cjs = BABEL_ENV === "cjs" || NODE_ENV === "test";
const prod = NODE_ENV === "production";

module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                loose: true,
                modules: false,
                include: ["transform-typeof-symbol"],
                useBuiltIns: "usage",
                forceAllTransforms: true
            }
        ],
        "@babel/preset-react",
        "@babel/preset-stage-2"
    ],
    plugins: [
        cjs && "@babel/transform-modules-commonjs",
        "annotate-pure-calls"
    ].filter(Boolean)
};
