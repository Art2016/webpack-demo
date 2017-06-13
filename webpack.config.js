const prod = process.env.NODE_ENV === 'production';
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack2Polyfill = require("webpack2-polyfill-plugin");
const template = require('./src/template.js');

const extractCommons = new webpack.optimize.CommonsChunkPlugin({
  name: 'commons',
  filename: prod ? '[name].[chunkhash].js' : '[name].js'
});
const extractCSS = new ExtractTextPlugin('[name].[chunkhash].bundle.css');

const config = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, 'src/script'),
  entry: {
    app: './app.js',
    admin: './admin.js',
    user: './user.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: '[id].[chunkhash].bundle.js'
  },
  module: {
    rules: [{
      test: /\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      include: path.resolve(__dirname, 'src/assets'),
      use: [{
        loader: 'url-loader',
        options: { limit: 10000 } // Convert images < 10k to base64 strings
      }]
    }, {
      test: /\.scss$/,
      include: path.resolve(__dirname, 'src/style'),
      use: prod ? extractCSS.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
      : ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.js$/,
      include: path.resolve(__dirname, 'src/script'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', { modules: false }], 'stage-0'
          ]
        }
      }],
      exclude: ['/node_modules']
    }]
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      "window.jQuery": 'jquery',
      "windows.jQuery": 'jquery'
    }),
    new Webpack2Polyfill(),
    extractCommons,
    extractCSS,
    new HtmlWebpackPlugin({
      chunks: ['commons', 'app'],
      filename: 'index.html',
      template: '!!html-webpack-plugin/lib/loader.js!./src/page/index.html',
      favicon: '../assets/favicon.ico',
      head: template.head('Hello Webpack!!')
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons', 'admin'],
      filename: 'admin.html',
      template: '!!html-webpack-plugin/lib/loader.js!./src/page/admin.html',
      favicon: '../assets/favicon.ico',
      head: template.head('Admin')
    }),
    new HtmlWebpackPlugin({
      chunks: ['commons', 'user'],
      filename: 'user.html',
      template: '!!html-webpack-plugin/lib/loader.js!./src/page/user.html',
      favicon: '../assets/favicon.ico',
      title: 'User'
    })
  ]
};

module.exports = config;
