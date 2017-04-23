const webpack = require('webpack');
const path = require('path');

const extractCommons = new webpack.optimize.CommonsChunkPlugin({
  name: 'commons',
  filename: 'commons.js'
});

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('[name].bundle.css');

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './app.js',
    admin: './admin.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    filename: '[name].bundle.js'
  },
  module: {
    rules: [{
      test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      include: path.resolve(__dirname, 'src'),
      use: [{
        loader: 'url-loader',
        options: { limit: 10000 } // Convert images < 10k to base64 strings
      }]
    }, {
      test: /\.scss$/,
      include: path.resolve(__dirname, 'src'),
      loader: extractCSS.extract(['css-loader','sass-loader'])
    }, {
      test: /\.js$/,
      include: path.resolve(__dirname, 'src'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { moduels: false }], 'stage-0'
          ]
        }
      }],
      exclude: ['/node_modules']
    }]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    extractCommons,
    extractCSS
  ]
};

module.exports = config;
