// extra-webpack.config.ts
import * as webpack from 'webpack';

export default {
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: [/lib\/assets\/index.html/], // or else our template replacements won't work here
        use: {
          loader: 'html-loader',
        },
      },
      {
        test: /\.svg$/,
        type: 'asset/inline',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __TITLE__: JSON.stringify("Tony Narlock's CV - Angular.js - v2 (WIP)"),
    }),
  ],
} as webpack.Configuration;
