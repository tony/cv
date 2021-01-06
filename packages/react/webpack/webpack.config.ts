import path from "path";

import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";

const projectRoot = path.join(__dirname, "../");

interface IWebpackEnv {
  devServerHost: string;
  devServerPort: string;
  open: boolean;
  watch: boolean;

  // Injected by webpack-cli
  WEBPACK_SERVE: boolean;
  WEBPACK_BUNDLE: boolean;
}

const defaultEnvironment: IWebpackEnv = {
  devServerHost: "localhost",
  devServerPort: "3099",
  open: false,
  watch: false,

  // Injected by webpack-cli
  WEBPACK_SERVE: false,
  WEBPACK_BUNDLE: false,
};

const __TITLE__ = "Tony Narlock's CV - React - v2 (WIP)";

const getConfig = (env: IWebpackEnv): webpack.Configuration => ({
  context: projectRoot,
  ...(env.WEBPACK_SERVE
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
  devtool: env.WEBPACK_BUNDLE ? "source-map" : "inline-source-map",
  entry: {
    cv: [
      ...(env.WEBPACK_SERVE
        ? [
            `webpack-dev-server/client?http://${env.devServerHost}:${env.devServerPort}`,
            "webpack/hot/dev-server",
          ]
        : []),
      "./src/entry.tsx",
    ],
  },
  mode: env.WEBPACK_BUNDLE ? "production" : "development",
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
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        type: "asset/inline",
      },
    ],
  },
  optimization: {
    runtimeChunk: "single",
  },
  output: {
    chunkFilename: "[name].[chunkhash].js",
    filename: "[name].[hash].js",
    path: path.resolve(projectRoot, "dist"),
  },
  plugins: [
    new webpack.DefinePlugin({
      __TITLE__: JSON.stringify(__TITLE__),
    }),
    new HtmlWebpackPlugin({
      template: "../lib/assets/index.html",
      favicon: "../data/img/favicon.ico",
      title: __TITLE__,
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  stats: { children: false },
  watch: env.watch,
});

export default (
  env: IWebpackEnv // Merge default environment params
): webpack.Configuration => getConfig({ ...defaultEnvironment, ...env });
