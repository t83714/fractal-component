const { NODE_ENV, BABEL_ENV } = process.env;

const cjs = BABEL_ENV === "cjs" || NODE_ENV === "test";
const loose = true;

const config = {
    babelrc: false,
    presets: [
        [
            "@babel/preset-env",
            {
                loose,
                modules: false,
                forceAllTransforms: true
            }
        ],
        "@babel/react"
    ],
    plugins: [
        cjs && "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-proposal-object-rest-spread", { loose }],
        "babel-plugin-annotate-pure-calls"
    ].filter(Boolean)
};
module.exports = require("babel-jest").createTransformer(config);
