var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/app/main.js',
  output: {
    path: path.resolve('public/assets/js/'),
    publicPath: 'assets/js/',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: 'public'
  },
  resolveLoader: {root: path.join(__dirname, 'node_modules')},
  module: {
    preLoaders: [
      {
        test: /^((?!config).)*\.js?$/,
        exclude: 'node_modules',
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /^((?!config).)*\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel-loader']
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: "raw-loader"
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
      },
      {test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery'},
      {
        test: /\.(woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {test: /\.ttf(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"},
      {test: /\.eot(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"},
      {test: /\.svg(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6']
  }
};
