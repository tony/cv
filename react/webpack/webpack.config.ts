import fs from "fs";
import os from "os";
import path from "path";

import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";

const projectRoot = path.join(__dirname, "../");

interface IWebpackEnv {
  devServerHost: string;
  devServerPort: string;
  production: boolean;
  watch: boolean;
}

const defaultDevServer = fs
  .readFileSync("/proc/version", "utf8")
  .toLowerCase()
  .includes("microsoft")
  ? os.networkInterfaces().eth0[0].address
  : "localhost";

const defaultEnvironment: IWebpackEnv = {
  devServerHost: defaultDevServer,
  devServerPort: "3099",
  production: true,
  watch: false
};

const getConfig = (env: IWebpackEnv): webpack.Configuration => ({
  context: projectRoot,
  ...(process.argv.some(arg => arg.includes("webpack-dev-server"))
    ? {
        devServer: {
          contentBase: "./dist",
          host: env.devServerHost,
          hot: true,
          open: true,
          port: parseInt(env.devServerPort, 10),
          publicPath: "/"
        }
      }
    : {}),
  devtool: env.production ? "source-map" : "inline-source-map",
  entry: [
    ...(process.argv.some(arg => arg.includes("webpack-dev-server"))
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
      ...[
        {
          configFile: path.resolve(projectRoot, "./tsconfig.json"),
          include: projectRoot,
          instance: "react-project"
        },
        {
          configFile: path.resolve(__dirname, "./tsconfig.json"),
          include: __dirname,
          instance: "webpack"
        },
        {
          configFile: path.resolve(projectRoot, "../tsconfig.json"),
          include: [
            path.resolve(projectRoot, ".."),
            path.resolve(projectRoot, "lib")
          ],
          instance: "lib"
        }
      ].map(
        ({ configFile, include, instance }) =>
          (({
            exclude: /node_modules/,
            include,
            test: /\.ts$/,
            use: {
              loader: "ts-loader",
              options: {
                configFile,
                instance
              }
            }
          } as any) as webpack.RuleSetRule)
      )
    ]
  },
  output: {
    filename: "cv.js",
    path: path.resolve(projectRoot, "dist")
  },
  plugins: [new HtmlWebpackPlugin({ template: "../lib/assets/index.html" })],
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  watch: env.watch
});

export default (
  env: IWebpackEnv // Merge default environment params
) => getConfig({ ...defaultEnvironment, ...env });
