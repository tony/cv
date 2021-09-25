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
      // {
      //   test: /nav\/nav\.scss$/,
      //   use: [
      //     // {
      //     //   loader: 'lit-scss-loader',
      //     //   options: {
      //     //     minify: true, // defaults to false
      //     //   },
      //     // },
      //
      //     'css-loader',
      //     'sass-loader',
      //
      //     //'extract-loader',
      //     // 'to-string-loader',
      //     // 'raw-loader',
      //     // 'css-loader',
      //     // 'sass-loader',
      //   ],
      //   // use: ['raw-loader', 'sass-loader'],
      //   // use: ['raw-loader', 'sass-loader'],
      // },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      __TITLE__: JSON.stringify("Tony Narlock's CV - Angular.js - v2 (WIP)"),
    }),
  ],
} as webpack.Configuration;
