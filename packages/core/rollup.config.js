import * as path from "path";
import nodeResolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";
import { uglify } from "rollup-plugin-uglify";
import json from "rollup-plugin-json";
import commonjs from "rollup-plugin-commonjs";
import builtins from 'rollup-plugin-node-builtins';
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

const createConfig = ({ input, output, external, env, min = false }) => ({
    input,
    experimentalCodeSplitting: typeof input !== "string",
    output: ensureArray(output).map(format =>
        Object.assign({}, format, {
            name: "FractalComponent",
            exports: "named"
        })
    ),
    external: makeExternalPredicate(
        external === "peers" ? peerDeps : deps.concat(peerDeps)
    ),
    plugins: [
        nodeResolve({
            jsnext: true
        }),
        json({
            exclude: ["../../node_modules/**"]
        }),
        commonjs({
            include: [
                "../../node_modules/object-path/**",
                "../../node_modules/object-path-immutable/**",
                "../../node_modules/lodash/*",
                "../../node_modules/uniqid/*"
            ]
        }),
        builtins(),
        babel({
            exclude: "../../node_modules/**",
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
    ].filter(Boolean)
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
            format: "umd"
        },
        external: "peers",
        env: "development"
    }),
    createConfig({
        input: "src/index.js",
        output: {
            file: "dist/" + pkg.name + ".min.umd.js",
            format: "umd"
        },
        external: "peers",
        env: "production",
        min: true
    })
];
