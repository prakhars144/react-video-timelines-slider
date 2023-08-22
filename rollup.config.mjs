import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import babel from "@rollup/plugin-babel";
import scss from "rollup-plugin-scss";

import packageJson from "./package.json" assert { type: "json" };

export default {
  input: "src/index.js",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true,
      name: "react-lib",
    },
    // {
    //   file: packageJson.module,
    //   format: "esm",
    //   sourcemap: true,
    // },
  ],
  plugins: [
    external(),
    resolve(),
    commonjs(),
    babel({ babelHelpers: "bundled", presets: ["@babel/preset-react"] }),
    scss({ fileName: "index.css", outputStyle: "compressed" }),
  ],
  // https://github.com/d3/d3-interpolate/issues/58
  onwarn: function (message) {
    if (message.code === "CIRCULAR_DEPENDENCY") {
      return;
    }
    console.error(message);
  },
};
