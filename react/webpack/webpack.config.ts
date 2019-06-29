import path from "path";

import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

const projectRoot = path.join(__dirname, "../");

const defaultEnvironment = {
  devServerHost: "localhost",
  devServerPort: 3000,
  development: false,
  production: true,
  watch: false
};

const getConfig = (env = defaultEnvironment): webpack.Configuration => ({
  context: projectRoot,
  ...(env.watch
    ? {
        devServer: {
          contentBase: "./dist",
          hot: true,
          open: true,
          port: env.devServerPort,
          publicPath: "/"
        }
      }
    : {}),
  devtool: env.production ? "source-map" : "inline-source-map",
  entry: [
    ...(env.watch
      ? [
          `webpack-dev-server/client?http://${env.devServerHost}:${env.devServerPort}`,
          "webpack/hot/dev-server"
        ]
      : []),
    "./src/entry.tsx"
  ],
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
            configFile: "./.babelrc"
          }
        }
      },
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "./tsconfig.json"
          }
        }
      }
    ]
  },
  output: {
    filename: "cv.js",
    path: path.resolve(projectRoot, "dist")
  },
  plugins: [new HtmlWebpackPlugin({ template: "../lib/assets/index.html" })],
  watch: env.watch
});

export default getConfig;
