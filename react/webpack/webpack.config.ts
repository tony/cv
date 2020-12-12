import fs from "fs";
import os from "os";
import path from "path";

import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";

const projectRoot = path.join(__dirname, "../");

interface IWebpackEnv {
  devServerHost: string;
  devServerPort: string;
  open: boolean;
  production: boolean;
  watch: boolean;
}

const defaultEnvironment: IWebpackEnv = {
  devServerHost: "localhost",
  devServerPort: "3099",
  open: false,
  production: false,
  watch: false,
};

const getConfig = (env: IWebpackEnv): webpack.Configuration => ({
  context: projectRoot,
  ...(process.argv.some((arg) => arg.includes("webpack-dev-server"))
    ? {
        devServer: {
          contentBase: "./dist",
          host: env.devServerHost,
          hot: true,
          open: env.open,
          port: parseInt(env.devServerPort, 10),
          publicPath: "/",
        },
      }
    : {}),
  devtool: env.production ? "source-map" : "inline-source-map",
  entry: {
    cv: [
      ...(process.argv.some((arg) => arg.includes("webpack-dev-server"))
        ? [
            `webpack-dev-server/client?http://${env.devServerHost}:${env.devServerPort}`,
            "webpack/hot/dev-server",
          ]
        : []),
      "./src/entry.tsx",
    ],
  },
  mode: env.production ? "production" : "development",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx$/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: true,
            configFile: "./.babelrc",
          },
        },
      },
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              // Prefer `dart-sass`
              implementation: require("sass"),
            },
          },
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(mod) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = mod.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `vendor.${packageName.replace("@", "")}`;
          },
        },
      },
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0,
    },
  },
  output: {
    chunkFilename: "[name].[chunkhash].js",
    filename: "[name].[hash].js",
    path: path.resolve(projectRoot, "dist"),
  },
  plugins: [new HtmlWebpackPlugin({ template: "../lib/assets/index.html" })],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  stats: { children: false },
  watch: env.watch,
});

export default (
  env: IWebpackEnv // Merge default environment params
) => getConfig({ ...defaultEnvironment, ...env });
