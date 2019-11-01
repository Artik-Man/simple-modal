const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './docs'),
  assets: 'assets/',
};

const extractLESS = new ExtractTextPlugin(PATHS.dist + '/styles.css');

module.exports = {
  devtool: 'source-map',
  entry: ['./src/index.ts', './src/index.html', './src/styles.less'],
  output: {
    filename: 'script.js',
    path: PATHS.dist,
  },
  resolve: {
    extensions: ['.ts', '.less', '.js', '.html'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.less$/,
        use: extractLESS.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { importLoaders: 1 } }, // importLoaders equals to number of loaders in array after this one.
            'less-loader',
          ],
        }),
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {},
        },
      },
    ],
  },
  devServer: {
    overlay: true,
  },
  plugins: [
    new CopyWebpackPlugin([{ from: PATHS.src + '/assets', to: PATHS.dist + '/assets' }]),
    new HtmlWebpackPlugin(),
    extractLESS,
  ],
};
