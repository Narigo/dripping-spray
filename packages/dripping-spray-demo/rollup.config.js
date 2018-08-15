const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");

module.exports = {
  input: "src/demo.js",
  output: {
    file: "../../docs/bundle.js",
    name: "dripping-spray-demo",
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
