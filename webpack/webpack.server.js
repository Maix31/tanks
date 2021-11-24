const path = require('path')
const nodeExternals = require('webpack-node-externals')
// const webpack = require('webpack')

module.exports = {
  target: "node",
  entry: {
    app: ["./src/server/main.ts"]
  },
  output: {
    path: path.resolve(__dirname, "built-server"),
    filename: "main.js"
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  externals: [nodeExternals()],
  mode: "development"
}