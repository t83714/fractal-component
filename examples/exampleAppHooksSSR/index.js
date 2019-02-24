require("@babel/register")({
    presets: [
        [
            "@babel/preset-env",
            {
                loose: true,
                modules: false,
                forceAllTransforms: true
            }
        ],
        "@babel/preset-react"
    ],
    plugins: [
        "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-proposal-object-rest-spread",
        "lodash"
    ].filter(Boolean)
});
require("./src/server");
