import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

export default [
    {
        input: "src/index.tsx",
        output: [
            {
                file: "dist/cjs/index.js",
                format: "cjs",
                sourcemap: true,
            },
            {
                file: "dist/esm/index.js",
                format: "es",
                sourcemap: true,
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({
                tsconfig: "./tsconfig.json",
                declaration: false,
            }),
            postcss({
                extensions: [".css"],
                inject: true,
                extract: "styles.css",
            }),
        ],
    },
    {
        input: "src/index.tsx",
        output: [{ file: "dist/index.d.ts", format: "es" }],
        external: [/\.css$/],
        plugins: [dts()],
    },
];
