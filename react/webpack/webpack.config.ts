import path from "path";

import webpack from "webpack";

const projectRoot = path.join(__dirname, "../");

const defaultEnvironment = {
  production: true
};
const getConfig = (env = defaultEnvironment): webpack.Configuration => ({
  mode: env.production ? "production" : "development",
  context: projectRoot,
  entry: path.join(projectRoot, "src/entry.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
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
            configFile: path.resolve(projectRoot, ".babelrc")
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.ts?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: path.resolve(projectRoot, "tsconfig.json")
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: []
});

export default getConfig;
