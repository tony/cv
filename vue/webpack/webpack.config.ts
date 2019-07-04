import fs from "fs";
import os from "os";
import path from "path";

import HtmlWebpackPlugin from "html-webpack-plugin";
import { VueLoaderPlugin } from "vue-loader";
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
  devServerPort: "3093",
  production: false,
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
  // devtool: env.production ? "source-map" : "cheap-module-eval-source-map",
  devtool: "cheap-module-eval-source-map",
  entry: {
    cv: [
      ...(process.argv.some(arg => arg.includes("webpack-dev-server"))
        ? [
            `webpack-dev-server/client?http://${env.devServerHost}:${env.devServerPort}`,
            "webpack/hot/dev-server"
          ]
        : []),
      "./src/index.ts"
    ]
  },
  mode: env.production ? "production" : "development",
  module: {
    rules: [
      {
        loader: "vue-loader",
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax",
            scss: "vue-style-loader!css-loader!sass-loader",
            ts: "babel-loader!ts-loader"
          }
        },
        test: /\.vue$/
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
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
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            appendTsSuffixTo: [/\.vue$/],
            configFile: "tsconfig.json"
          }
        }
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"]
      }
    ]
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
          }
        }
      },
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 0
    }
  },
  output: {
    chunkFilename: "[name].[chunkhash].js",
    filename: "[name].[hash].js",
    path: path.resolve(projectRoot, "dist")
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({ template: "../lib/assets/index.html" })
  ],
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js"
    },
    extensions: [".ts", ".js", ".vue", ".json"]
  },
  watch: env.watch
});

export default (
  env: IWebpackEnv // Merge default environment params
) => getConfig({ ...defaultEnvironment, ...env });
