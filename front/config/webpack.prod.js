const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "static/js/main.js",
    clean: true,
    assetModuleFilename: "static/images/[hash:10][ext][query]",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
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
          filename: "static/fonts/[hash:10][ext]",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options:{
            cacheDirectory:true,
            cacheCompression:false
        }
      },
    ],
  },
  //   optimization:{
  //     minimizer:[
  //         new CssMinimizerPlugin()
  //     ]
  //   },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }),// 抽取css
    new CssMinimizerPlugin(),//css压缩
  ],
  mode: "production",
  devtool: "source-map",
};
