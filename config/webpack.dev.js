const webpack = require('webpack')
const webpackCommonConf = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const { srcPath, distPath } = require('./paths')
module.exports = merge(webpackCommonConf, {
  mode: "development", // 开发环境
  // 输出source-map的方式，增加调试。eval是默认推荐的选择，build fast and rebuild fast！
  devtool: "source-map",
  module: {
    rules: [
      // 直接引入图片 url
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        type: 'asset/resource'
      },
      {
        // 匹配json文件
        test: /\.json$/,
        // 将json文件视为文件类型
        type: "asset/resource",
        generator: {
          // 这里专门针对json文件的处理
          filename: "static/[name].[hash][ext][query]",
        },
      },
      // 样式配置
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: [
          'style-loader', 'css-loader', 'sass-loader', {
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
    // DefinePlugin 允许在 编译时 将你代码中的变量替换为其他值或表达式。
    new webpack.DefinePlugin({
      ENV: JSON.stringify('development')
    })
  ],
  devServer: {
    port: 3000,
    open: true,  // 自动打开浏览器
    compress: true,  // 启动 gzip 压缩
    client: {
      progress: true,
    },
    // 设置代理
    proxy: {
      // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
      '/api': 'http://localhost:3000',

      // 将本地 /api2/xxx 代理到 localhost:3000/xxx
      '/api2': {
        target: 'http://localhost:3000',
        // 允许跨域
        changeOrigin: true,
        // 重写路径 - 根据自己的实际需要处理，不需要直接忽略该项设置即可
        pathRewrite: {
          // 该处理是代码中使用/api开头的请求，如/api/userinfo，实际转发对应服务器的路径是/userinfo
          '/api2': ''
        },
        // https服务的地址，忽略证书相关
        secure: false,
      }
    }
  }
})