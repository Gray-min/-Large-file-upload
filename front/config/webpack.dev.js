const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry: "./src/main.js",
  output: {
    path: undefined,
    filename: "js/main.js",
    assetModuleFilename: "images/[hash:10][ext][query]",
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.(png|jpe?g|gif)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024,
              },
            },
          },
          {
            test: /\.ttf/,
            type: "asset/resource",
            generator: {
              filename: "fonts/[hash:10][ext]",
            },
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  devServer: {
    host: "localhost",
    port: 5000,
    open: true,
    hot: true,
  },
  mode: "development",
  devtool:"cheap-source-map"
};
