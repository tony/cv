// extra-webpack.config.ts
import * as webpack from 'webpack';

export default {
  plugins: [
    new webpack.DefinePlugin({
      __TITLE__: JSON.stringify("Tony Narlock's CV"),
    }),
  ],
} as webpack.Configuration;
