import path from "path";

import webpack from "webpack";

const projectRoot = path.join(__dirname, "../");

const defaultEnvironment = {
  production: true
};
const getConfig = (env = defaultEnvironment): webpack.Configuration => ({
  mode: env.production ? "production" : "development",
  context: projectRoot,
  entry: "./src/entry.tsx",
  output: {
    path: path.resolve(projectRoot, "dist"),
    filename: "cv.js"
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: true,
            configFile: "./.babelrc"
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.ts?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "./tsconfig.json"
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: []
});

export default getConfig;
