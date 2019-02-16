import * as path from "path";
import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";
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
    ...props
}) => ({
    input,
    output: ensureArray(output).map(format =>
        Object.assign({}, format, {
            name: "RandomGifPairPair",
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
        nodeResolve({
            jsnext: true
        }),
        json({
            exclude: ["../../node_modules/**"]
        }),
        commonjs({
            include: "../../node_modules/**"
        }),
        babel({
            exclude: "../../node_modules/**",
            runtimeHelpers: true,
            babelrcRoots: path.resolve(__dirname, "../*")
        }),
        env &&
            replace({
                "process.env.NODE_ENV": JSON.stringify(env)
            }),
        min &&
            uglify({
                compress: {
                    pure_getters: true,
                    unsafe: true,
                    unsafe_comps: true,
                    warnings: false
                }
            })
    ].filter(Boolean),
    ...props
});

export default [
    createConfig({
        input: "src/index.js",
        output: {
            format: "esm",
            file: "dist/" + pkg.name + ".esm.js"
        }
    }),
    createConfig({
        input: "src/index.js",
        output: {
            format: "cjs",
            file: "dist/" + pkg.name + ".cjs.js"
        }
    }),
    createConfig({
        input: "src/index.js",
        output: {
            file: "dist/" + pkg.name + ".umd.js",
            format: "umd",
            globals: {
                "fractal-component": "FractalComponent",
                jss: "jss",
                "jss-preset-default": "jssPreset",
                react: "React",
                "redux-saga/effects": "ReduxSaga.effects",
                "prop-types": "PropTypes",
                "@fractal-components/random-gif-pair": "RandomGifPair"
            }
        },
        external: "peers",
        env: "development"
    }),
    createConfig({
        input: "src/index.js",
        output: {
            file: "dist/" + pkg.name + ".min.umd.js",
            format: "umd",
            globals: {
                "fractal-component": "FractalComponent",
                jss: "jss",
                "jss-preset-default": "jssPreset",
                react: "React",
                "redux-saga/effects": "ReduxSaga.effects",
                "prop-types": "PropTypes",
                "@fractal-components/random-gif-pair": "RandomGifPair"
            }
        },
        external: "peers",
        env: "production",
        min: true
    })
];
