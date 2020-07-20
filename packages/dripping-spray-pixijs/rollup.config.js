const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const builtins = require("rollup-plugin-node-builtins");
// const globals = require("rollup-plugin-node-globals");

module.exports = {
  input: "src/index.js",
  output: {
    file: "lib/index.js",
    name: "dripping-spray-pixijs",
    format: "umd",
  },
  plugins: [
    // globals(),
    builtins(),
    nodeResolve(),
    commonjs(),
  ],
};
