
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./webpack.base')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const {styleLoaders} = require('./tools')
module.exports = merge(baseWebpack, {
  // cheap-module-eval-source-map быстрее для разработки
  watch: true,
  module: {
    rules: styleLoaders({ sourceMap: false })
  },
  devtool: 'source-map',
  devServer: {
    inline:true,
    port: 8008
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new FriendlyErrorsPlugin()
  ]
})
