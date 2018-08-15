const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");

module.exports = {
  input: "src/index.js",
  output: {
    file: "lib/index.js",
    name: "dripping-spray-pixijs",
    format: "umd"
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({})
  ]
};
