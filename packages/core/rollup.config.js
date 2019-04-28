import * as path from "path";
import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";
import json from "rollup-plugin-json";
import commonjs from "rollup-plugin-commonjs";
import pkg from "./package.json";

const ensureArray = maybeArr =>
    Array.isArray(maybeArr) ? maybeArr : [maybeArr];

const makeExternalPredicate = externalArr => {
    if (!externalArr.length) {
        return () => false;
    }
    const pattern = new RegExp(`^(${externalArr.join("|")})($|/)`);
    return id => pattern.test(id);
};

const deps = Object.keys(pkg.dependencies || {});
const peerDeps = Object.keys(pkg.peerDependencies || {});

const createConfig = ({
    input,
    output,
    external,
    env,
    min = false,
    reactNative = false,
    useBabel = true,
    ...props
}) => {
    return {
        input,
        output: ensureArray(output).map(format =>
            Object.assign({}, format, {
                name: "FractalComponent",
                exports: "named"
            })
        ),
        external: makeExternalPredicate(
            external === "peers" ? peerDeps : deps.concat(peerDeps)
        ),
        onwarn(warning, warn) {
            if (warning.code === "CIRCULAR_DEPENDENCY") return;
            warn(warning);
        },
        plugins: [
            replace({
                include: "./**",
                __PACKAGE_NAME__: JSON.stringify(pkg.name),
                __PACKAGE_VERSION__: JSON.stringify(pkg.version)
            }),
            reactNative &&
                replace({
                    include: "./**",
                    __REACT_NATIVE_BUNDLE__: "true"
                }),
            !reactNative &&
                replace({
                    include: "./**",
                    __REACT_NATIVE_BUNDLE__: "false"
                }),
            reactNative &&
                replace({
                    include: "./**",
                    'require("os").networkInterfaces()': "({})",
                    delimiters: ["", ""]
                }),
            nodeResolve({
                mainFields: ["module", "jsnext:main", "main"]
            }),
            env &&
                replace({
                    "process.env.NODE_ENV": JSON.stringify(env)
                }),
            json({
                exclude: ["../../node_modules/**"]
            }),
            commonjs({
                include: "../../node_modules/**"
            }),
            useBabel &&
                babel({
                    exclude: "../../node_modules/**",
                    runtimeHelpers: true,
                    babelrcRoots: path.resolve(__dirname, "../*")
                }),
            min &&
                terser({
                    compress: {
                        pure_getters: true,
                        unsafe: true,
                        unsafe_comps: true,
                        warnings: false
                    }
                })
        ].filter(Boolean),
        ...props
    };
};

export default [
    // --- CommonJS
    createConfig({
        input: "src/index.js",
        output: {
            format: "cjs",
            file: "dist/" + pkg.name + ".cjs.js"
        }
    }),
    // --- ES Module
    createConfig({
        input: "src/index.js",
        output: {
            format: "esm",
            file: "dist/" + pkg.name + ".esm.js"
        }
    }),
    // --- ES Module for Web Browser
    createConfig({
        input: "src/index.js",
        output: {
            format: "esm",
            file: "dist/" + pkg.name + ".esm.mjs"
        },
        env: "production",
        min: true,
        useBabel: false
    }),
    // --- Bundle for React Native Metro Bundler
    createConfig({
        input: "src/index.js",
        output: {
            format: "cjs",
            file: "dist/" + pkg.name + ".react-native.js"
        },
        reactNative: true
    }),
    // --- UMD Development
    createConfig({
        input: "src/index.js",
        output: {
            file: "dist/" + pkg.name + ".umd.js",
            format: "umd",
            globals: {
                react: "React",
                "prop-types": "PropTypes",
                "redux-saga": "ReduxSaga",
                "redux-saga/utils": "ReduxSaga.utils",
                "redux-saga/effects": "ReduxSaga.effects"
            }
        },
        external: "peers",
        env: "development"
    }),
    // --- UMD Production
    createConfig({
        input: "src/index.js",
        output: {
            file: "dist/" + pkg.name + ".min.umd.js",
            format: "umd",
            globals: {
                react: "React",
                "prop-types": "PropTypes",
                "redux-saga": "ReduxSaga",
                "redux-saga/utils": "ReduxSaga.utils",
                "redux-saga/effects": "ReduxSaga.effects"
            }
        },
        external: "peers",
        env: "production",
        min: true
    })
];
