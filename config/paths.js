/**
 * @description 常用文件夹路径
 */

const path = require('path')

const srcPath = path.join(__dirname, '..', 'src')
const distPath = path.join(__dirname, '..', 'dist')
const publicPath = path.join(__dirname, '..', 'public')

module.exports = {
  srcPath,
  distPath,
  publicPath
}
