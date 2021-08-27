const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
// webpack needs to be explicitly required
const webpack = require("webpack");

module.exports = {
  stats: { errorDetails: true },
  target: "webworker",
  output: {
    path: path.join(process.cwd(), "bin"),
    filename: "index.js",
  },
  // mode: 'production',
  mode: "production",
  devtool: "cheap-module-source-map",
  optimization: {
    sideEffects: true,
    minimize: false
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
    mainFields: ['browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      }
    ],
  },
  plugins: [
		new NodePolyfillPlugin({
			excludeAliases: ["console"]
		})
	]
};
