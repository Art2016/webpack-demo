const env = process.env.NODE_ENV;
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractCommons = new webpack.optimize.CommonsChunkPlugin({
  name: 'commons',
  filename: '[name].js'
});
const extractCSS = new ExtractTextPlugin('[name].bundle.css');

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    app: './app.js',
    admin: './admin.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: env === 'production' ? './dist/' : '/dist/',
    filename: '[name].[chunkhash].bundle.js',
    chunkFilename: '[id].[chunkhash].bundle.js'
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
      use: env === 'production' ? extractCSS.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      })
      : ['style-loader', 'css-loader', 'sass-loader']
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
    }, {
      test: /\.handlebars$/,
      loader: 'handlebars-loader',
    }]
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
    new webpack.NamedModulesPlugin(),
    // new ManifestPlugin({
    //   fileName: 'assets.json',
    //   basePath: '/',
    //   writeToFileEmit: true
    // }),
    extractCommons,
    extractCSS,
    new HtmlWebpackPlugin({
        chunks: ["commons", "app"],
        filename: "index.html",
        template: "!!html-webpack-plugin/lib/loader.js!./src/index.html", // or ./[name].html
        inject: "body" // or true?
    }),
  ]
};

module.exports = config;
