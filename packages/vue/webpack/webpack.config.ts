import path from "path";

import HtmlWebpackPlugin from "html-webpack-plugin";
import { VueLoaderPlugin } from "vue-loader";
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
  devServerPort: "3093",
  open: false,
  watch: false,

  // Injected by webpack-cli
  WEBPACK_SERVE: false,
  WEBPACK_BUNDLE: false,
};

const __TITLE__ = "Tony Narlock's CV - Vue.js - v2 (WIP)";

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
      "./src/index.ts",
    ],
  },
  mode: env.WEBPACK_BUNDLE ? "production" : "development",
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
            ts: "babel-loader!ts-loader",
          },
        },
        test: /\.vue$/,
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
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
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            appendTsSuffixTo: [/\.vue$/],
            configFile: "../tsconfig.json",
          },
        },
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["vue-style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.svg$/,
        // use: ["babel-loader", "vue-svg-loader"],
        type: "asset/inline",
      },
      {
        test: /\.html$/,
        exclude: [/lib\/assets\/index.html/], // or else our template replacements won't work here
        use: {
          loader: "html-loader",
        },
      },
    ],
  },
  cache: {
    // 1. Set cache type to filesystem
    type: "filesystem",

    buildDependencies: {
      // 2. Add your config as buildDependency to get cache invalidation on config change
      config: [__filename],

      // 3. If you have other things the build depends on you can add them here
      // Note that webpack, loaders and all modules referenced from your config are automatically added
    },
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
    // @ts-ignore
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: "../lib/assets/index.html",
      favicon: "../data/img/favicon.ico",
      title: __TITLE__,
    }),
  ],
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
    },
    extensions: [".ts", ".js", ".vue", ".json", ".html", ".scss"],
  },
  stats: { children: false },
  watch: env.watch,
});

export default (
  env: IWebpackEnv // Merge default environment params
): webpack.Configuration => getConfig({ ...defaultEnvironment, ...env });
