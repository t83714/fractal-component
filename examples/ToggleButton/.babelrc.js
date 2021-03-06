const { NODE_ENV, BABEL_ENV } = process.env;

const cjs = BABEL_ENV === "cjs" || NODE_ENV === "test";
const loose = true;

module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                loose,
                modules: false,
                forceAllTransforms: true
            }
        ],
        "@babel/preset-react"
    ],
    plugins: [
        cjs && "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-proposal-object-rest-spread", { loose }],
        "babel-plugin-annotate-pure-calls"
    ].filter(Boolean)
};
