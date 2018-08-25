import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import { list as babelHelpersList } from "@babel/helpers";
import json from "rollup-plugin-json";
import commonjs from "rollup-plugin-commonjs";
import builtins from 'rollup-plugin-node-builtins';

var env = process.env.NODE_ENV;
var config = {
    output: {
        format: "umd",
        name: "FractalComponent",
        exports: "named"
    },
    plugins: [
        nodeResolve({
            jsnext: true
        }),
        babel({
            exclude: ["node_modules/**", "**/*.json"],
            include: ["node_modules/uniqid/**", "src/**"],
            externalHelpersWhitelist: babelHelpersList.filter(
                helperName => helperName !== "AsyncGenerator"
            )
        }),
        json({
            exclude: ["node_modules/**"]
        }),
        replace({
            "process.env.NODE_ENV": JSON.stringify(env)
        })
    ]
};

if (env === "production" || env === "development") {
    config.plugins.push(
        commonjs({
            include: "node_modules/**",
            exclude: ["node_modules/process-es6/**"],
            namedExports: {
                "node_modules/react/index.js": [
                    "Component",
                    "PureComponent",
                    "Fragment",
                    "Children",
                    "createElement"
                ]
            }
        }),
        builtins()
    );
}

if (env === "production") {
    config.plugins.push(
        uglify({
            compress: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false
            }
        })
    );
}

export default config;
