const path = require('path')
const { srcPath, distPath, publicPath } = require('./paths')
const HtmlWebpackPlugin = require('html-webpack-plugin')
console.log("srcPath", srcPath)
module.exports = {
  // 入口文件
  entry: {
    main: path.join(srcPath, 'index.js')
  },
  resolve: {
    // 定义了扩展名之后，在import文件时就可以不用写后缀名了，会按循序依次查找
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".less"],
    // 设置链接
    // alias: {
    //   // 注意resolve方法开始的查找的路径是/
    //   "@": srcPath,
    // },
  },
  module: {
    rules: [
      {
        // 匹配js/jsx
        test: /\.jsx?$/,
        // 排除node_modules
        exclude: /node_modules/,
        use: {
          // 确定使用的loader
          loader: "babel-loader",
          // 参数配置
          options: {
            presets: [
              [
                // 预设polyfill
                "@babel/preset-env",
                {
                  // polyfill 只加载使用的部分
                  useBuiltIns: "usage",
                  // 使用corejs解析，模块化
                  corejs: "3",
                },
              ],
              // 解析react
              "@babel/preset-react",
            ],
            // 使用transform-runtime，避免全局污染，注入helper
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(publicPath, 'index.html'),
      // 收藏夹图标
      favicon: path.resolve(__dirname, "..", './public/favicon.ico'),
    })
  ]
}