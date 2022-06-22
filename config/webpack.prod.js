const webpack = require('webpack')
const { merge } = require("webpack-merge");
const webpackCommonConf = require('./webpack.common.js')
const { distPath } = require('./paths')

const MinCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
module.exports = merge(webpackCommonConf, {
  // 指定打包环境
  mode: "production",
  output: {
    // filename: 'bundle.[contenthash:8].js',  // 打包代码时，加上 hash 戳
    filename: '[name].[contenthash:8].js', // name 即多入口时 entry 的 key
    path: distPath,
    // 每次编译输出的时候，清空dist目录 - 这里就不需要clean-webpack-plugin了
    clean: true,
    // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
  },
  cache: {
    type: 'memory', //使用内存缓存
  },
  module: {
    rules: [
      {
        // 匹配图片文件
        test: /\.(png|jpg|jpeg|gif)$/i,
        // 设置资源处理的类型为asset
        type: "asset",
        parser: {
          // 转为inline dataUrl的条件
          dataUrlCondition: {
            // 默认限制为8kb，现在调整限制为10kb，大文件直接作为asset/resource类型文件输出
            maxSize: 10 * 1024,
          },
        },
      },
      // 抽离 css 或者 sass
      {
        test: /\.(css|scss)$/,
        use: [
          MinCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // 浏览器前缀自动补全
                plugins: ["autoprefixer"]
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // window.ENV = 'production'
      ENV: JSON.stringify('production')
    }),
    new MinCssExtractPlugin({
      filename: "[name].[contenthash:8].css"
    })
  ],
  optimization: {
    minimize: true,
    // 压缩 js css
    minimizer: [new TerserJSPlugin({}), new CssMinimizerPlugin({})],
    // 分割代码块
    splitChunks: {
      chunks: 'all',
      /**
       * initial 入口chunk，对于异步导入的文件不处理
          async 异步chunk，只对异步导入的文件处理
          all 全部chunk
       */

      // 缓存分组
      cacheGroups: {
        // 第三方模块
        vendor: {
          name: 'vendor', // chunk 名称
          priority: 1, // 权限更高，优先抽离，重要！！！
          test: /node_modules/,
          minSize: 0,  // 大小限制
          minChunks: 1  // 最少复用过几次
        },

        // 公共的模块
        common: {
          name: 'common', // chunk 名称
          priority: 0, // 优先级
          minSize: 0,  // 公共模块的大小限制
          minChunks: 2  // 公共模块最少复用过几次
        }
      }
    }
  }
});