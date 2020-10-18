import path from "path";

import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import ReactRefreshPlugin from "@webhotelier/webpack-fast-refresh";
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

const getConfig = (env: IWebpackEnv): webpack.Configuration => {
  const isWebpackServer = process.argv.includes("serve");
  console.log({ env, argv: process.argv, isWebpackServer });

  return {
    context: projectRoot,
    ...(isWebpackServer
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
        ...(isWebpackServer
          ? [
              "@webhotelier/webpack-fast-refresh/runtime.js",
              `webpack-dev-server/client?http://${env.devServerHost}:${env.devServerPort}`,
            ]
          : []),
        "./src/entry.tsx",
      ] as [string, ...string[]],
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
          test: /\.tsx$/,
          loader: "@webhotelier/webpack-fast-refresh/loader.js",
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

        {
          test: /\.svg$/,
          use: [
            {
              loader: "svg-url-loader",
              options: {
                limit: 10000,
              },
            },
          ],
        },
      ],
    },
    output: {
      chunkFilename: "[name].[chunkhash].js",
      filename: "[name].[hash].js",
      path: path.resolve(projectRoot, "dist"),
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "../lib/assets/index.html" }),
      ...(isWebpackServer ? [new ReactRefreshPlugin()] : []),
    ],
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
    },
    stats: { children: false },
    watch: env.watch,
  };
};

export default (
  env: IWebpackEnv // Merge default environment params
): webpack.Configuration => getConfig({ ...defaultEnvironment, ...env });
